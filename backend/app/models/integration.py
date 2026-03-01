from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db import Base


class Integration(Base):
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # telegram
    bot_token = Column(String, nullable=False)
    username = Column(String, nullable=True)
    active = Column(Boolean, default=True)