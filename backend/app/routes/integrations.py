from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.integration import Integration
from app.auth import get_current_user
import requests
import os

router = APIRouter()

BACKEND_URL = os.getenv("WEBHOOK_BASE_URL")

@router.post("/integrations/telegram")
def save_telegram_integration(payload: dict,
                               db: Session = Depends(get_db),
                               user = Depends(get_current_user)):

    bot_token = payload["bot_token"]
    username = payload.get("username")

    integration = Integration(
        user_id=user.id,
        type="telegram",
        bot_token=bot_token,
        username=username,
        active=True
    )

    db.add(integration)
    db.commit()
    db.refresh(integration)

    # Registrar webhook automaticamente
    webhook_url = f"{BACKEND_URL}/api/webhook/telegram/{user.id}"

    requests.post(
        f"https://api.telegram.org/bot{bot_token}/setWebhook",
        json={"url": webhook_url}
    )

    return {"success": True}