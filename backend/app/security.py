from datetime import datetime, timedelta, timezone
import base64
from typing import Optional

from cryptography.fernet import Fernet
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# ---------------------------------------------------
# PASSWORD
# ---------------------------------------------------

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def hash_password(password: str):
    password = password.encode("utf-8")[:72].decode("utf-8", errors="ignore")
    return pwd_context.hash(password)


# ---------------------------------------------------
# JWT
# ---------------------------------------------------

def create_token(payload: dict, expires_minutes: int) -> str:
    to_encode = payload.copy()
    exp = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": exp})
    return jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


# ---------------------------------------------------
# CURRENT USER (SEM DEPENDER DE MODEL USER)
# ---------------------------------------------------

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_token(token)
    user_id: Optional[int] = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    # Retorna objeto simples mockado só para não quebrar integração
    class UserObj:
        def __init__(self, id: int):
            self.id = id

    return UserObj(int(user_id))


# ---------------------------------------------------
# ENCRYPTION
# ---------------------------------------------------

def _get_fernet() -> Fernet:
    key = settings.encryption_key.encode()
    key = base64.urlsafe_b64encode(key.ljust(32, b"0")[:32])
    return Fernet(key)


def encrypt_secret(raw: str) -> str:
    f = _get_fernet()
    return f.encrypt(raw.encode()).decode()


def decrypt_secret(enc: str) -> str:
    f = _get_fernet()
    return f.decrypt(enc.encode()).decode()