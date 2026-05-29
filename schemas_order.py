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
