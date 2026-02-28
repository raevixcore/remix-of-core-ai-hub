from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)
    company_name: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class RefreshIn(BaseModel):
    refresh_token: str


class ForgotPasswordIn(BaseModel):
    email: EmailStr


class ResetPasswordIn(BaseModel):
    token: str
    new_password: str = Field(min_length=6)


class TelegramIn(BaseModel):
    token: str
    username: str | None = None
    name: str | None = None
    description: str | None = None
    secret_token: str | None = None


class WhatsappIn(BaseModel):
    phone_number_id: str
    access_token: str
    verify_token: str | None = None
    business_account_id: str | None = None


class InstagramIn(BaseModel):
    page_id: str
    access_token: str


class SendMessageIn(BaseModel):
    message: str


class AIConfigIn(BaseModel):
    api_key: str | None = None
    base_prompt: str
    temperature: float = 0.3
    language: str = "pt-BR"
