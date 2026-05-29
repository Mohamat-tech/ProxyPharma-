# ══════════════════════════════════════════════════════════════
# FILE: backend/app/config.py
# ══════════════════════════════════════════════════════════════
"""
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App
    app_name: str = "ProxyPharma API"
    app_version: str = "1.0.0"
    app_env: str = "development"
    frontend_url: str = "http://localhost:3000"

    # Database
    database_url: str

    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Storage S3/R2
    s3_endpoint: str = ""
    s3_bucket: str = "proxypharma-ordonnances"
    s3_access_key_id: str = ""
    s3_secret_access_key: str = ""

    # Mobile Money
    orange_money_api_key: str = ""
    orange_money_client_id: str = ""
    orange_money_client_secret: str = ""
    mtn_momo_api_key: str = ""
    mtn_momo_client_id: str = ""
    mtn_momo_client_secret: str = ""

    # Notifications
    fcm_server_key: str = ""
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone: str = ""

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
"""


# ══════════════════════════════════════════════════════════════
# FILE: backend/app/database.py
# ══════════════════════════════════════════════════════════════
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
"""


# ══════════════════════════════════════════════════════════════
# FILE: backend/app/utils/security.py
# ══════════════════════════════════════════════════════════════
"""
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou expiré",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key,
                             algorithms=[settings.algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user

def require_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    return current_user
"""


# ══════════════════════════════════════════════════════════════
# FILE: backend/app/utils/otp.py
# ══════════════════════════════════════════════════════════════
"""
import random
import string
from datetime import datetime, timedelta
import redis
from app.config import settings

r = redis.from_url(settings.redis_url)

def generate_otp(length: int = 4) -> str:
    return ''.join(random.choices(string.digits, k=length))

def store_otp(order_id: str, otp: str, ttl_minutes: int = 10):
    key = f"otp:{order_id}"
    r.setex(key, timedelta(minutes=ttl_minutes), otp)

def verify_otp(order_id: str, otp: str) -> bool:
    key = f"otp:{order_id}"
    stored = r.get(key)
    if stored and stored.decode() == otp:
        r.delete(key)
        return True
    return False
"""


# ══════════════════════════════════════════════════════════════
# FILE: backend/app/schemas/auth.py
# ══════════════════════════════════════════════════════════════
"""
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    gdpr_consent: bool

    @validator('gdpr_consent')
    def consent_required(cls, v):
        if not v:
            raise ValueError('Le consentement RGPD est obligatoire')
        return v

    @validator('phone')
    def phone_format(cls, v):
        v = v.replace(' ', '').replace('-', '')
        if not v.startswith('+237') or len(v) < 12:
            raise ValueError('Format invalide. Ex: +237 6XX XXX XXX')
        return v

class UserLogin(BaseModel):
    phone: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    role: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
"""


# ══════════════════════════════════════════════════════════════
# FILE: backend/app/schemas/medicine.py
# ══════════════════════════════════════════════════════════════
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MedicineBase(BaseModel):
    name: str
    dci: str
    brand: Optional[str] = None
    cpnn_code: str
    category: str
    description: Optional[str] = None
    indication: Optional[str] = None
    posology: Optional[str] = None
    requires_prescription: bool = False
    amm_valid: bool = True

class MedicineOut(MedicineBase):
    id: str
    amm_number: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class MedicineWithStock(MedicineOut):
    available_pharmacies: int = 0
    min_price: Optional[float] = None
    max_price: Optional[float] = None

class StockOut(BaseModel):
    pharmacy_id: str
    pharmacy_name: str
    pharmacy_dist: Optional[float] = None
    quantity: int
    price: float
    delivery_time: Optional[int] = None  # minutes
    certified: bool

    class Config:
        from_attributes = True
"""


# ══════════════════════════════════════════════════════════════
# FILE: backend/app/schemas/order.py
# ══════════════════════════════════════════════════════════════
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OrderItemCreate(BaseModel):
    medicine_id: str
    quantity: int

class OrderCreate(BaseModel):
    pharmacy_id: str
    ordonnance_id: Optional[str] = None
    payment_method: str
    payment_phone: Optional[str] = None
    delivery_address: str
    delivery_lat: Optional[float] = None
    delivery_lng: Optional[float] = None
    items: List[OrderItemCreate]

class OrderOut(BaseModel):
    id: str
    order_number: str
    status: str
    payment_method: str
    payment_status: str
    total_amount: float
    delivery_fee: float
    delivery_address: str
    estimated_delivery: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class OTPConfirm(BaseModel):
    otp_code: str
"""


# ══════════════════════════════════════════════════════════════
# FILE: backend/app/services/payment.py
# ══════════════════════════════════════════════════════════════
"""
import httpx
from app.config import settings
from loguru import logger

class OrangeMoneyService:
    BASE_URL = "https://api.orange.com/orange-money-webpay/cm/v1"

    async def initiate_payment(
        self,
        amount: float,
        phone: str,
        order_ref: str,
        callback_url: str,
    ) -> dict:
        # Stub — integrate with real Orange Money API
        logger.info(f"Orange Money payment: {amount} FCFA → {phone}")
        return {
            "status": "pending",
            "payment_url": f"https://api.orange.com/pay/{order_ref}",
            "ref": order_ref,
        }

class MTNMoMoService:
    BASE_URL = "https://sandbox.momodeveloper.mtn.com"

    async def initiate_payment(
        self,
        amount: float,
        phone: str,
        order_ref: str,
    ) -> dict:
        # Stub — integrate with real MTN MoMo API
        logger.info(f"MTN MoMo payment: {amount} FCFA → {phone}")
        return {
            "status": "pending",
            "transaction_id": order_ref,
        }

orange_money = OrangeMoneyService()
mtn_momo = MTNMoMoService()
"""


# ══════════════════════════════════════════════════════════════
# FILE: backend/app/services/notifications.py
# ══════════════════════════════════════════════════════════════
"""
from loguru import logger
from app.config import settings

async def send_sms(phone: str, message: str):
    try:
        # Twilio integration
        from twilio.rest import Client
        client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        client.messages.create(
            body=message,
            from_=settings.twilio_phone,
            to=phone,
        )
        logger.info(f"SMS sent to {phone}")
    except Exception as e:
        logger.error(f"SMS failed: {e}")

async def send_otp_sms(phone: str, otp: str, order_number: str):
    message = (
        f"ProxyPharma — Votre code OTP pour confirmer "
        f"la réception de la commande {order_number} est : {otp}. "
        f"Valable 10 minutes."
    )
    await send_sms(phone, message)

async def send_order_confirmation_sms(phone: str, order_number: str, eta: int):
    message = (
        f"ProxyPharma — Commande {order_number} confirmée ! "
        f"Livraison estimée : {eta} minutes. "
        f"Suivez votre commande sur l'application."
    )
    await send_sms(phone, message)
"""
