from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.integration import Integration
from app.security import get_current_user
from app.config import settings
import requests

router = APIRouter()

@router.post("/integrations/telegram")
def save_telegram_integration(
    payload: dict,
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
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

    webhook_url = f"{settings.webhook_base_url}/api/webhook/telegram/{user.id}"

    requests.post(
        f"https://api.telegram.org/bot{bot_token}/setWebhook",
        json={"url": webhook_url},
    )

    return {"success": True}