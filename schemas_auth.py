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
