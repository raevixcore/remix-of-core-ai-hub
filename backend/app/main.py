from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import secrets
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import and_
from sqlalchemy.orm import Session

from .config import settings
from .db import Base, SessionLocal, engine, get_db
from .models import (
    AIConfig,
    Client,
    Conversation,
    Integration,
    Message,
    Notification,
    PasswordResetToken,
    Plan,
    RefreshToken,
    SystemLog,
    User,
    Workspace,
)
from .schemas import (
    AIConfigIn,
    ForgotPasswordIn,
    InstagramIn,
    LoginIn,
    RefreshIn,
    RegisterIn,
    ResetPasswordIn,
    SendMessageIn,
    TelegramIn,
    WhatsappIn,
)
from .security import create_token, decode_token, decrypt_secret, encrypt_secret, hash_password, verify_password

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None


app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(Plan).count():
            db.add_all(
                [
                    Plan(name="starter", max_users=3, max_channels=1, max_ai_messages=300, max_storage_mb=200),
                    Plan(name="growth", max_users=15, max_channels=3, max_ai_messages=5000, max_storage_mb=2000),
                    Plan(name="enterprise", max_users=200, max_channels=10, max_ai_messages=100000, max_storage_mb=15000),
                ]
            )
            db.commit()
    finally:
        db.close()


def write_log(db: Session, client_id: int, category: str, action: str, details: str, level: str = "info"):
    db.add(SystemLog(client_id=client_id, category=category, action=action, details=details, level=level))


def notify(db: Session, client_id: int, kind: str, content: str, user_id: int | None = None):
    db.add(Notification(client_id=client_id, user_id=user_id, type=kind, content=content))


def current_user(authorization: str = Header(default=""), db: Session = Depends(get_db)) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.split(" ", 1)[1]
    try:
        payload = decode_token(token)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Invalid auth token") from exc

    if not payload.get("user_id") or not payload.get("client_id"):
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if user.client_id != payload["client_id"]:
        raise HTTPException(status_code=401, detail="Client mismatch")

    if user.status != "active":
        raise HTTPException(status_code=403, detail="User inactive")

    return user


def require_role(user: User, roles: list[str]):
    if user.role not in roles:
        raise HTTPException(status_code=403, detail="Insufficient permissions")


def get_plan(db: Session, client_id: int) -> Plan:
    client = db.query(Client).filter(Client.id == client_id).first()
    return db.query(Plan).filter(Plan.id == client.plan_id).first()


def to_chat_payload(conv: Conversation) -> dict[str, Any]:
    return {
        "name": conv.external_user_id,
        "platform": conv.channel,
        "status": conv.status,
        "messages": [
            {
                "message": m.content,
                "timestamp": m.created_at.isoformat(),
                "from": "user" if m.sender == "customer" else m.sender,
            }
            for m in conv.messages
        ],
    }


def generate_ai_reply(db: Session, client_id: int, incoming_text: str) -> str:
    config = db.query(AIConfig).filter(AIConfig.client_id == client_id).first()
    if not config:
        return "Obrigado pela mensagem! Em breve retornaremos."

    key = decrypt_secret(config.api_key_encrypted) if config.api_key_encrypted else settings.openai_api_key
    if not key or OpenAI is None:
        return "Recebemos sua mensagem e estamos processando seu atendimento."

    plan = get_plan(db, client_id)
    usage = db.query(Message).join(Conversation).filter(and_(Conversation.client_id == client_id, Message.sender == "ai")).count()
    if usage >= plan.max_ai_messages:
        notify(db, client_id, "plan_limit", "Limite de mensagens IA atingido para o plano atual.")
        return "Seu plano atingiu o limite de IA. Contate o administrador."

    client = OpenAI(api_key=key)
    completion = client.responses.create(
        model=settings.openai_model,
        input=[
            {"role": "system", "content": config.base_prompt},
            {"role": "user", "content": incoming_text},
        ],
        temperature=float(config.temperature),
    )
    write_log(db, client_id, "ai", "ai_triggered", "Resposta gerada pela OpenAI")
    return completion.output_text or "Posso ajudar em mais alguma coisa?"


@app.get(f"{settings.api_prefix}/health")
def health():
    return {"status": "ok"}


@app.post(f"{settings.api_prefix}/register")
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already in use")

    starter = db.query(Plan).filter(Plan.name == "starter").first()
    company_name = payload.company_name or f"{payload.name.split(' ')[0]} Company"

    client = Client(name=company_name, email=payload.email, plan_id=starter.id)
    db.add(client)
    db.flush()

    admin = User(
        client_id=client.id,
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="admin",
        status="active",
    )
    db.add(admin)
    db.add(Workspace(client_id=client.id, name="Main Workspace"))
    db.add(AIConfig(client_id=client.id))
    write_log(db, client.id, "auth", "register", "Empresa e usuário admin criados")
    notify(db, client.id, "user_created", f"Usuário administrador {payload.name} criado", admin.id)
    db.commit()

    return {"message": "Account created"}


@app.post(f"{settings.api_prefix}/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_payload = {"user_id": user.id, "client_id": user.client_id, "role": user.role}
    access = create_token(access_payload, settings.access_token_minutes)
    refresh = create_token(access_payload, settings.refresh_token_minutes)
    db.add(
        RefreshToken(
            user_id=user.id,
            token=refresh,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.refresh_token_minutes),
        )
    )
    user.last_login = datetime.utcnow()
    write_log(db, user.client_id, "auth", "login", f"Login efetuado por {user.email}")
    db.commit()

    return {
        "access_token": access,
        "refresh_token": refresh,
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "client_id": user.client_id},
    }


@app.post(f"{settings.api_prefix}/refresh")
def refresh(payload: RefreshIn, db: Session = Depends(get_db)):
    token_row = db.query(RefreshToken).filter(RefreshToken.token == payload.refresh_token, RefreshToken.revoked.is_(False)).first()
    if not token_row or token_row.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    claims = decode_token(payload.refresh_token)
    new_access = create_token({"user_id": claims["user_id"], "client_id": claims["client_id"], "role": claims["role"]}, settings.access_token_minutes)
    return {"access_token": new_access, "refresh_token": payload.refresh_token}


@app.post(f"{settings.api_prefix}/logout")
def logout(payload: RefreshIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    row = db.query(RefreshToken).filter(RefreshToken.token == payload.refresh_token).first()
    if row:
        row.revoked = True
    write_log(db, user.client_id, "auth", "logout", f"Logout de {user.email}")
    db.commit()
    return {"message": "logged out"}


@app.post(f"{settings.api_prefix}/forgot-password")
def forgot_password(payload: ForgotPasswordIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        return {"message": "if account exists, reset token sent"}

    token = secrets.token_urlsafe(32)
    db.add(PasswordResetToken(user_id=user.id, token=token, expires_at=datetime.utcnow() + timedelta(minutes=30)))
    write_log(db, user.client_id, "auth", "password_reset_requested", f"Reset solicitado para {user.email}")
    notify(db, user.client_id, "password_reset", "Token de recuperação gerado", user.id)
    db.commit()
    return {"message": "reset token generated", "token": token}


@app.post(f"{settings.api_prefix}/reset-password")
def reset_password(payload: ResetPasswordIn, db: Session = Depends(get_db)):
    token = db.query(PasswordResetToken).filter(PasswordResetToken.token == payload.token, PasswordResetToken.used.is_(False)).first()
    if not token or token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="invalid or expired token")
    user = db.query(User).filter(User.id == token.user_id).first()
    user.password_hash = hash_password(payload.new_password)
    token.used = True
    write_log(db, user.client_id, "auth", "password_reset", f"Senha alterada para {user.email}")
    db.commit()
    return {"message": "password updated"}


@app.get(f"{settings.api_prefix}/integrations/status")
def integration_status(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Integration).filter(Integration.client_id == user.client_id).all()
    mapped = {"telegram": False, "whatsapp": False, "instagram": False}
    for row in rows:
        mapped[row.platform] = row.status == "connected"
    return mapped


def _save_integration(db: Session, client_id: int, platform: str, config: dict):
    row = db.query(Integration).filter(Integration.client_id == client_id, Integration.platform == platform).first()
    if not row:
        row = Integration(client_id=client_id, platform=platform, config=config, status="connected")
        db.add(row)
    else:
        row.config = config
        row.status = "connected"
    write_log(db, client_id, "integration", "connected", f"{platform} conectado")
    notify(db, client_id, "integration_connected", f"Integração {platform} conectada")


@app.post(f"{settings.api_prefix}/integrations/telegram")
def save_telegram(payload: TelegramIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    _save_integration(db, user.client_id, "telegram", {"token": encrypt_secret(payload.token), "secret": payload.secret_token})
    db.commit()
    return {"message": "telegram saved"}


@app.post(f"{settings.api_prefix}/integrations/whatsapp")
def save_whatsapp(payload: WhatsappIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    _save_integration(
        db,
        user.client_id,
        "whatsapp",
        {
            "phone_number_id": payload.phone_number_id,
            "access_token": encrypt_secret(payload.access_token),
            "verify_token": payload.verify_token,
            "business_account_id": payload.business_account_id,
        },
    )
    db.commit()
    return {"message": "whatsapp saved"}


@app.post(f"{settings.api_prefix}/integrations/instagram")
def save_instagram(payload: InstagramIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    _save_integration(db, user.client_id, "instagram", {"page_id": payload.page_id, "access_token": encrypt_secret(payload.access_token)})
    db.commit()
    return {"message": "instagram saved"}


@app.delete(f"{settings.api_prefix}/integrations/{{platform}}")
def delete_integration(platform: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    row = db.query(Integration).filter(Integration.client_id == user.client_id, Integration.platform == platform).first()
    if row:
        row.status = "disconnected"
    write_log(db, user.client_id, "integration", "disconnected", f"{platform} desconectado")
    notify(db, user.client_id, "integration_disconnected", f"Integração {platform} desconectada")
    db.commit()
    return {"message": "integration disconnected"}


@app.post(f"{settings.api_prefix}/integrations/telegram/start")
def start_telegram(user: User = Depends(current_user), db: Session = Depends(get_db)):
    write_log(db, user.client_id, "integration", "webhook_set", "Webhook Telegram configurado")
    db.commit()
    return {"message": "telegram webhook configured"}


@app.get(f"{settings.api_prefix}/conversations")
def list_conversations(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    conversations = (
        db.query(Conversation)
        .filter(Conversation.client_id == user.client_id)
        .order_by(Conversation.created_at.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )
    return {str(c.id): to_chat_payload(c) for c in conversations}


@app.post(f"{settings.api_prefix}/conversations/{{conversation_id}}/assume")
def assume(conversation_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == int(conversation_id), Conversation.client_id == user.client_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conv.status = "human"
    conv.assigned_user_id = user.id
    write_log(db, user.client_id, "conversation", "assume", f"Conversa {conv.id} assumida")
    db.commit()
    return {"message": "ok"}


@app.post(f"{settings.api_prefix}/conversations/{{conversation_id}}/bot")
def back_to_bot(conversation_id: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == int(conversation_id), Conversation.client_id == user.client_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conv.status = "bot"
    write_log(db, user.client_id, "conversation", "bot_mode", f"Conversa {conv.id} retornou ao bot")
    db.commit()
    return {"message": "ok"}


@app.post(f"{settings.api_prefix}/send/{{conversation_id}}")
def send_message(conversation_id: str, payload: SendMessageIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == int(conversation_id), Conversation.client_id == user.client_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db.add(Message(conversation_id=conv.id, sender="human", content=payload.message))
    write_log(db, user.client_id, "message", "message_sent", f"Mensagem enviada na conversa {conv.id}")
    db.commit()
    return {"message": "sent"}


@app.post(f"{settings.api_prefix}/ai/config")
def save_ai_config(payload: AIConfigIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    require_role(user, ["admin", "manager"])
    cfg = db.query(AIConfig).filter(AIConfig.client_id == user.client_id).first()
    cfg.base_prompt = payload.base_prompt
    cfg.temperature = str(payload.temperature)
    cfg.language = payload.language
    if payload.api_key:
        cfg.api_key_encrypted = encrypt_secret(payload.api_key)
    write_log(db, user.client_id, "config", "ai_updated", "Configuração de IA atualizada")
    db.commit()
    return {"message": "updated"}


@app.get(f"{settings.api_prefix}/notifications")
def notifications(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Notification).filter(Notification.client_id == user.client_id).order_by(Notification.created_at.desc()).limit(50).all()
    return [
        {"id": n.id, "type": n.type, "content": n.content, "read": n.read, "created_at": n.created_at.isoformat()}
        for n in rows
    ]


@app.get(f"{settings.api_prefix}/logs")
def logs(user: User = Depends(current_user), db: Session = Depends(get_db)):
    require_role(user, ["admin", "manager"])
    rows = db.query(SystemLog).filter(SystemLog.client_id == user.client_id).order_by(SystemLog.created_at.desc()).limit(100).all()
    return [
        {
            "id": l.id,
            "level": l.level,
            "category": l.category,
            "action": l.action,
            "details": l.details,
            "created_at": l.created_at.isoformat(),
        }
        for l in rows
    ]


@app.post(f"{settings.api_prefix}/webhook/telegram")
async def telegram_webhook(request: Request, db: Session = Depends(get_db), x_telegram_bot_api_secret_token: str | None = Header(default=None)):
    payload = await request.json()
    return _handle_telegram(payload, x_telegram_bot_api_secret_token, db)


def _handle_telegram(payload: Any, secret_header: str | None, db: Session):
    update = payload if isinstance(payload, dict) else {}
    message = update.get("message", {})
    text = message.get("text")
    if not text:
        return {"ok": True}

    token = update.get("token")
    integrations = db.query(Integration).filter(Integration.platform == "telegram", Integration.status == "connected").all()
    integration = None
    for candidate in integrations:
        try:
            if decrypt_secret(candidate.config.get("token", "")) == token:
                integration = candidate
                break
        except Exception:
            continue

    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    expected_secret = integration.config.get("secret")
    if expected_secret and secret_header != expected_secret:
        write_log(db, integration.client_id, "webhook", "telegram_failed", "Secret token inválido", level="warning")
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid secret token")

    external_user_id = str(message.get("from", {}).get("id", "unknown"))
    conv = (
        db.query(Conversation)
        .filter(Conversation.client_id == integration.client_id, Conversation.channel == "telegram", Conversation.external_user_id == external_user_id)
        .first()
    )
    if not conv:
        conv = Conversation(client_id=integration.client_id, channel="telegram", external_user_id=external_user_id, status="bot")
        db.add(conv)
        db.flush()
        notify(db, integration.client_id, "new_conversation", "Nova conversa criada via Telegram")

    db.add(Message(conversation_id=conv.id, sender="customer", content=text))
    write_log(db, integration.client_id, "message", "message_received", f"Telegram msg em conversa {conv.id}")

    reply = generate_ai_reply(db, integration.client_id, text)
    db.add(Message(conversation_id=conv.id, sender="ai", content=reply))
    notify(db, integration.client_id, "ai_response", "IA respondeu uma mensagem")
    db.commit()
    return {"ok": True, "reply": reply}


async def verify_meta_signature(request: Request, app_secret: str) -> None:
    signature = request.headers.get("X-Hub-Signature-256")
    if not signature:
        raise HTTPException(status_code=403, detail="Missing signature")

    body = await request.body()
    expected = "sha256=" + hmac.new(app_secret.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=403, detail="Invalid signature")


@app.get(f"{settings.api_prefix}/webhook/whatsapp")
def whatsapp_verify(mode: str = Query(default=""), challenge: str = Query(default=""), verify_token: str = Query(alias="hub.verify_token", default=""), db: Session = Depends(get_db)):
    if mode != "subscribe":
        raise HTTPException(status_code=400, detail="invalid mode")
    rows = db.query(Integration).filter(Integration.platform == "whatsapp", Integration.status == "connected").all()
    if not any(r.config.get("verify_token") == verify_token for r in rows):
        raise HTTPException(status_code=403, detail="verify token mismatch")
    return int(challenge) if challenge.isdigit() else challenge


@app.post(f"{settings.api_prefix}/webhook/whatsapp")
async def whatsapp_webhook(request: Request, db: Session = Depends(get_db)):
    await verify_meta_signature(request, settings.meta_app_secret)
    payload = await request.json()

    phone_number_id = (
        payload.get("entry", [{}])[0]
        .get("changes", [{}])[0]
        .get("value", {})
        .get("metadata", {})
        .get("phone_number_id")
    )
    if not phone_number_id:
        raise HTTPException(status_code=400, detail="Missing phone_number_id")

    phone_field = Integration.config["phone_number_id"]
    phone_filter = phone_field.astext if hasattr(phone_field, "astext") else phone_field.as_string()
    integration = (
        db.query(Integration)
        .filter(
            Integration.platform == "whatsapp",
            Integration.status == "connected",
            phone_filter == phone_number_id,
        )
        .first()
    )
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")

    entry = (payload.get("entry") or [{}])[0]
    changes = (entry.get("changes") or [{}])[0]
    value = changes.get("value") or {}
    msgs = value.get("messages") or []
    for msg in msgs:
        external_user_id = msg.get("from", "unknown")
        text = (msg.get("text") or {}).get("body", "")
        conv = (
            db.query(Conversation)
            .filter(Conversation.client_id == integration.client_id, Conversation.channel == "whatsapp", Conversation.external_user_id == external_user_id)
            .first()
        )
        if not conv:
            conv = Conversation(client_id=integration.client_id, channel="whatsapp", external_user_id=external_user_id)
            db.add(conv)
            db.flush()
            notify(db, integration.client_id, "new_conversation", "Nova conversa via WhatsApp")
        db.add(Message(conversation_id=conv.id, sender="customer", content=text))
        ai = generate_ai_reply(db, integration.client_id, text)
        db.add(Message(conversation_id=conv.id, sender="ai", content=ai))
        write_log(db, integration.client_id, "message", "message_received", f"WhatsApp msg em conversa {conv.id}")
    db.commit()
    return {"ok": True}


@app.post(f"{settings.api_prefix}/webhook/instagram")
async def instagram_webhook(request: Request, db: Session = Depends(get_db)):
    await verify_meta_signature(request, settings.meta_app_secret)
    payload = await request.json()

    for entry in payload.get("entry", []):
        page_id = entry.get("id")
        if not page_id:
            continue

        page_field = Integration.config["page_id"]
        page_filter = page_field.astext if hasattr(page_field, "astext") else page_field.as_string()
        integration = (
            db.query(Integration)
            .filter(
                Integration.platform == "instagram",
                Integration.status == "connected",
                page_filter == str(page_id),
            )
            .first()
        )
        if not integration:
            raise HTTPException(status_code=404, detail="Integration not found")

        for messaging in entry.get("messaging", []):
            sender_id = messaging.get("sender", {}).get("id", "unknown")
            text = messaging.get("message", {}).get("text", "")
            if not text:
                continue
            conv = (
                db.query(Conversation)
                .filter(Conversation.client_id == integration.client_id, Conversation.channel == "instagram", Conversation.external_user_id == sender_id)
                .first()
            )
            if not conv:
                conv = Conversation(client_id=integration.client_id, channel="instagram", external_user_id=sender_id)
                db.add(conv)
                db.flush()
                notify(db, integration.client_id, "new_conversation", "Nova conversa via Instagram")
            db.add(Message(conversation_id=conv.id, sender="customer", content=text))
            ai = generate_ai_reply(db, integration.client_id, text)
            db.add(Message(conversation_id=conv.id, sender="ai", content=ai))
            write_log(db, integration.client_id, "message", "message_received", f"Instagram msg em conversa {conv.id}")
    db.commit()
    return {"ok": True}


@app.get(f"{settings.api_prefix}/integrations/manuals")
def integration_manuals(user: User = Depends(current_user)):
    return {
        "telegram": {
            "title": "Configuração Telegram",
            "steps": [
                "Abra o BotFather e crie um bot com /newbot.",
                "Copie o BOT TOKEN e opcionalmente defina um Secret Token.",
                "Cole no formulário de integração e clique em salvar.",
                "Use Teste de conexão para validar o webhook.",
            ],
            "fields": [
                {"name": "token", "description": "Token do bot gerado pelo BotFather", "example": "123456:ABC-DEF"},
                {"name": "secret_token", "description": "Token de validação de segurança opcional", "example": "my-secret"},
            ],
        },
        "whatsapp": {
            "title": "Configuração WhatsApp Cloud API/Twilio",
            "steps": [
                "No Meta Developer ou Twilio, gere Access Token e Phone Number ID.",
                "Defina Verify Token para validação do webhook.",
                "Salve e valide o endpoint de webhook.",
            ],
            "fields": [
                {"name": "access_token", "description": "Token do provedor", "example": "EAAB..."},
                {"name": "phone_number_id", "description": "Identificador do número WhatsApp", "example": "123456789"},
                {"name": "verify_token", "description": "Token usado no desafio de webhook", "example": "verify-core-ai"},
            ],
        },
        "instagram": {
            "title": "Configuração Instagram Graph API",
            "steps": [
                "Conecte conta comercial a uma página do Facebook.",
                "Gere token Graph API com permissões de mensagens.",
                "Informe page_id e access_token no sistema.",
            ],
            "fields": [
                {"name": "page_id", "description": "ID da página vinculada", "example": "987654321"},
                {"name": "access_token", "description": "Token da Graph API", "example": "IGQVJ..."},
            ],
        },
        "status": "connected if integration is active",
        "requested_by": user.id,
    }


@app.post(f"{settings.api_prefix}/billing/plan/{{plan_name}}")
def change_plan(plan_name: str, user: User = Depends(current_user), db: Session = Depends(get_db)):
    require_role(user, ["admin"])
    plan = db.query(Plan).filter(Plan.name == plan_name).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    client = db.query(Client).filter(Client.id == user.client_id).first()
    client.plan_id = plan.id
    notify(db, user.client_id, "plan_changed", f"Plano alterado para {plan.name}")
    write_log(db, user.client_id, "billing", "plan_changed", f"Plano alterado para {plan.name}")
    db.commit()
    return {"message": "plan updated", "plan": plan.name}
