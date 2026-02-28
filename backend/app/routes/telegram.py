from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.integration import Integration
from app.services.openai_service import generate_ai_response
import requests

router = APIRouter()

@router.post("/webhook/telegram/{user_id}")
async def telegram_webhook(user_id: int,
                           request: Request,
                           db: Session = Depends(get_db)):

    data = await request.json()

    if "message" not in data:
        return {"ok": True}

    text = data["message"].get("text")
    chat_id = data["message"]["chat"]["id"]

    integration = db.query(Integration).filter(
        Integration.user_id == user_id,
        Integration.type == "telegram"
    ).first()

    if not integration:
        return {"error": "Integration not found"}

    ai_response = generate_ai_response(text)

    requests.post(
        f"https://api.telegram.org/bot{integration.bot_token}/sendMessage",
        json={
            "chat_id": chat_id,
            "text": ai_response
        }
    )

    return {"ok": True}