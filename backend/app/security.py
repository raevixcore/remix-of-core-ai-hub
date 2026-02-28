from datetime import datetime, timedelta, timezone
import base64

from cryptography.fernet import Fernet
from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_token(payload: dict, expires_minutes: int) -> str:
    to_encode = payload.copy()
    exp = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": exp})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise ValueError("Invalid token") from exc


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
