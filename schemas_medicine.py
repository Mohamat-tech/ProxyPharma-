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
    delivery_time: Optional[int] = None
    certified: bool

    class Config:
        from_attributes = True
