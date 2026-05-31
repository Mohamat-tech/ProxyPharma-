from sqlalchemy import (
    Column, String, Integer, Float, Boolean,
    DateTime, ForeignKey, Text, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid
import enum


def gen_uuid():
    return str(uuid.uuid4())


# ── ENUMS ─────────────────────────────────────────────────────
class UserRole(str, enum.Enum):
    USER     = "user"
    ADMIN    = "admin"
    PHARMACY = "pharmacy"
    RIDER    = "rider"


class OrderStatus(str, enum.Enum):
    PENDING     = "pending"
    CONFIRMED   = "confirmed"
    PREPARING   = "preparing"
    IN_DELIVERY = "in_delivery"
    DELIVERED   = "delivered"
    CANCELLED   = "cancelled"


class PaymentMethod(str, enum.Enum):
    ORANGE_MONEY = "orange_money"
    MTN_MOMO     = "mtn_momo"
    CASH         = "cash"


# ── USER ──────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id               = Column(String, primary_key=True, default=gen_uuid)
    name             = Column(String(100), nullable=False)
    email            = Column(String(150), unique=True, nullable=False)
    phone            = Column(String(20),  unique=True, nullable=False)
    hashed_password  = Column(String, nullable=False)
    role             = Column(Enum(UserRole), default=UserRole.USER)
    address          = Column(Text, nullable=True)
    is_active        = Column(Boolean, default=True)
    gdpr_consent     = Column(Boolean, default=False)
    gdpr_consent_date = Column(DateTime, nullable=True)
    created_at       = Column(DateTime, server_default=func.now())
    updated_at       = Column(DateTime, onupdate=func.now())

    orders      = relationship("Order",      back_populates="user",
                               foreign_keys="Order.user_id")
    ordonnances = relationship("Ordonnance", back_populates="user")


# ── PHARMACY ──────────────────────────────────────────────────
class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id            = Column(String, primary_key=True, default=gen_uuid)
    name          = Column(String(150), nullable=False)
    address       = Column(Text, nullable=False)
    city          = Column(String(50), nullable=False)
    latitude      = Column(Float, nullable=False)
    longitude     = Column(Float, nullable=False)
    phone         = Column(String(20), nullable=False)
    email         = Column(String(150), nullable=True)
    onpc_number   = Column(String(50), unique=True, nullable=False)
    dpml_certified = Column(Boolean, default=False)
    is_active     = Column(Boolean, default=True)
    is_open       = Column(Boolean, default=False)
    is_guard      = Column(Boolean, default=False)
    opening_hours = Column(Text, nullable=True)
    rating        = Column(Float, default=0.0)
    review_count  = Column(Integer, default=0)
    created_at    = Column(DateTime, server_default=func.now())

    stocks = relationship("Stock",  back_populates="pharmacy")
    orders = relationship("Order",  back_populates="pharmacy")


# ── MEDICINE ──────────────────────────────────────────────────
class Medicine(Base):
    __tablename__ = "medicines"

    id                   = Column(String, primary_key=True, default=gen_uuid)
    name                 = Column(String(200), nullable=False)
    dci                  = Column(String(200), nullable=False)
    brand                = Column(String(150), nullable=True)
    cpnn_code            = Column(String(50),  unique=True, nullable=False)
    category             = Column(String(100), nullable=False)
    description          = Column(Text, nullable=True)
    indication           = Column(Text, nullable=True)
    posology             = Column(Text, nullable=True)
    side_effects         = Column(Text, nullable=True)
    contraindications    = Column(Text, nullable=True)
    requires_prescription = Column(Boolean, default=False)
    amm_valid            = Column(Boolean, default=True)
    amm_number           = Column(String(100), nullable=True)
    created_at           = Column(DateTime, server_default=func.now())

    stocks = relationship("Stock", back_populates="medicine")


# ── STOCK ─────────────────────────────────────────────────────
class Stock(Base):
    __tablename__ = "stocks"

    id          = Column(String, primary_key=True, default=gen_uuid)
    pharmacy_id = Column(String, ForeignKey("pharmacies.id"), nullable=False)
    medicine_id = Column(String, ForeignKey("medicines.id"), nullable=False)
    quantity    = Column(Integer, default=0)
    price       = Column(Float,   nullable=False)
    updated_at  = Column(DateTime, onupdate=func.now(),
                         server_default=func.now())

    pharmacy = relationship("Pharmacy", back_populates="stocks")
    medicine = relationship("Medicine", back_populates="stocks")


# ── ORDONNANCE ────────────────────────────────────────────────
class Ordonnance(Base):
    __tablename__ = "ordonnances"

    id              = Column(String, primary_key=True, default=gen_uuid)
    user_id         = Column(String, ForeignKey("users.id"), nullable=False)
    file_url        = Column(String, nullable=False)   # Encrypted S3/R2 URL
    prescriber_onmc = Column(String(100), nullable=True)
    delivery_date   = Column(DateTime, nullable=True)
    verified        = Column(Boolean, default=False)
    verified_by     = Column(String, nullable=True)
    verified_at     = Column(DateTime, nullable=True)
    created_at      = Column(DateTime, server_default=func.now())

    user   = relationship("User",  back_populates="ordonnances")
    orders = relationship("Order", back_populates="ordonnance")


# ── ORDER ─────────────────────────────────────────────────────
class Order(Base):
    __tablename__ = "orders"

    id               = Column(String, primary_key=True, default=gen_uuid)
    order_number     = Column(String(20), unique=True, nullable=False)
    user_id          = Column(String, ForeignKey("users.id"),       nullable=False)
    pharmacy_id      = Column(String, ForeignKey("pharmacies.id"),  nullable=False)
    ordonnance_id    = Column(String, ForeignKey("ordonnances.id"), nullable=True)
    rider_id         = Column(String, ForeignKey("users.id"),       nullable=True)
    status           = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    payment_method   = Column(Enum(PaymentMethod), nullable=False)
    payment_status   = Column(String(50), default="pending")
    payment_ref      = Column(String(100), nullable=True)
    total_amount     = Column(Float, nullable=False)
    delivery_fee     = Column(Float, default=500.0)
    delivery_address = Column(Text, nullable=False)
    delivery_lat     = Column(Float, nullable=True)
    delivery_lng     = Column(Float, nullable=True)
    otp_code         = Column(String(10), nullable=True)
    otp_confirmed    = Column(Boolean, default=False)
    estimated_delivery = Column(Integer, nullable=True)  # minutes
    created_at       = Column(DateTime, server_default=func.now())
    delivered_at     = Column(DateTime, nullable=True)

    user       = relationship("User",       foreign_keys=[user_id],
                              back_populates="orders")
    pharmacy   = relationship("Pharmacy",   back_populates="orders")
    ordonnance = relationship("Ordonnance", back_populates="orders")
    items      = relationship("OrderItem",  back_populates="order")


# ── ORDER ITEM ────────────────────────────────────────────────
class OrderItem(Base):
    __tablename__ = "order_items"

    id          = Column(String, primary_key=True, default=gen_uuid)
    order_id    = Column(String, ForeignKey("orders.id"),   nullable=False)
    medicine_id = Column(String, ForeignKey("medicines.id"), nullable=False)
    quantity    = Column(Integer, nullable=False)
    unit_price  = Column(Float,   nullable=False)

    order    = relationship("Order",    back_populates="items")
    medicine = relationship("Medicine")
