from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from ..models.integration import Integration
from app.models.user import User
from app.security import decode_token
from fastapi.security import OAuth2PasswordBearer
import requests
import os

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

BACKEND_URL = os.getenv("WEBHOOK_BASE_URL")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        payload = decode_token(token)
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user


@router.post("/integrations/telegram")
def save_telegram_integration(
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    bot_token = payload["bot_token"]
    username = payload.get("username")

    integration = Integration(
        user_id=user.id,
        type="telegram",
        bot_token=bot_token,
        username=username,
        active=True,
    )

    db.add(integration)
    db.commit()
    db.refresh(integration)

    webhook_url = f"{BACKEND_URL}/api/webhook/telegram/{user.id}"

    requests.post(
        f"https://api.telegram.org/bot{bot_token}/setWebhook",
        json={"url": webhook_url},
    )

    return {"success": True}