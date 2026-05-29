from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
import random
import string
from app.database import get_db
from app import models
from app.utils.security import get_current_user
from app.utils.otp import generate_otp, store_otp, verify_otp
from app.services.notifications import send_otp_sms, send_order_confirmation_sms

router = APIRouter()


def gen_order_number() -> str:
    suffix = ''.join(random.choices(string.digits, k=5))
    year = datetime.utcnow().year
    return f"PP-{year}-{suffix}"


# ── CREATE ORDER ──────────────────────────────────────────────
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: dict,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Validate pharmacy
    pharmacy = db.query(models.Pharmacy).filter(
        models.Pharmacy.id == payload["pharmacy_id"],
        models.Pharmacy.is_active == True,
        models.Pharmacy.dpml_certified == True,
    ).first()
    if not pharmacy:
        raise HTTPException(404, "Pharmacie non trouvée ou non certifiée DPML")

    # Validate items & calculate total
    total = 0.0
    order_items = []

    for item in payload["items"]:
        stock = db.query(models.Stock).filter(
            models.Stock.pharmacy_id == payload["pharmacy_id"],
            models.Stock.medicine_id == item["medicine_id"],
            models.Stock.quantity >= item["quantity"],
        ).first()

        if not stock:
            raise HTTPException(
                400,
                f"Stock insuffisant pour le médicament {item['medicine_id']}"
            )

        # Check ordonnance for prescription meds
        if stock.medicine.requires_prescription and not payload.get("ordonnance_id"):
            raise HTTPException(
                400,
                "Une ordonnance est requise pour ce médicament (ONMC)"
            )

        total += stock.price * item["quantity"]
        order_items.append({
            "medicine_id": item["medicine_id"],
            "quantity": item["quantity"],
            "unit_price": stock.price,
            "stock": stock,
        })

    delivery_fee = 500.0
    total_amount = total + delivery_fee

    # Generate OTP
    otp = generate_otp(4)

    # Create order
    order = models.Order(
        order_number=gen_order_number(),
        user_id=current_user.id,
        pharmacy_id=payload["pharmacy_id"],
        ordonnance_id=payload.get("ordonnance_id"),
        payment_method=payload["payment_method"],
        total_amount=total_amount,
        delivery_fee=delivery_fee,
        delivery_address=payload["delivery_address"],
        delivery_lat=payload.get("delivery_lat"),
        delivery_lng=payload.get("delivery_lng"),
        otp_code=otp,
        estimated_delivery=30,
        status=models.OrderStatus.CONFIRMED,
    )
    db.add(order)

    # Create order items & update stock
    for item_data in order_items:
        order_item = models.OrderItem(
            order_id=order.id,
            medicine_id=item_data["medicine_id"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
        )
        db.add(order_item)
        item_data["stock"].quantity -= item_data["quantity"]

    db.commit()
    db.refresh(order)

    # Store OTP in Redis
    store_otp(order.id, otp)

    # Send SMS in background
    background_tasks.add_task(
        send_otp_sms,
        current_user.phone,
        otp,
        order.order_number,
    )
    background_tasks.add_task(
        send_order_confirmation_sms,
        current_user.phone,
        order.order_number,
        order.estimated_delivery,
    )

    return {
        "id": order.id,
        "order_number": order.order_number,
        "status": order.status,
        "total_amount": order.total_amount,
        "delivery_fee": order.delivery_fee,
        "estimated_delivery": order.estimated_delivery,
        "message": "Commande créée — OTP envoyé par SMS",
    }


# ── GET MY ORDERS ─────────────────────────────────────────────
@router.get("/my")
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    orders = db.query(models.Order).filter(
        models.Order.user_id == current_user.id
    ).order_by(models.Order.created_at.desc()).all()

    return [
        {
            "id": o.id,
            "order_number": o.order_number,
            "status": o.status,
            "total_amount": o.total_amount,
            "pharmacy_name": o.pharmacy.name,
            "estimated_delivery": o.estimated_delivery,
            "created_at": o.created_at,
        }
        for o in orders
    ]


# ── GET ORDER BY ID ───────────────────────────────────────────
@router.get("/{order_id}")
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == current_user.id,
    ).first()

    if not order:
        raise HTTPException(404, "Commande non trouvée")

    return {
        "id": order.id,
        "order_number": order.order_number,
        "status": order.status,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "total_amount": order.total_amount,
        "delivery_fee": order.delivery_fee,
        "delivery_address": order.delivery_address,
        "estimated_delivery": order.estimated_delivery,
        "otp_confirmed": order.otp_confirmed,
        "pharmacy": {
            "id": order.pharmacy.id,
            "name": order.pharmacy.name,
            "phone": order.pharmacy.phone,
            "address": order.pharmacy.address,
        },
        "items": [
            {
                "medicine_id": item.medicine_id,
                "medicine_name": item.medicine.name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": item.quantity * item.unit_price,
            }
            for item in order.items
        ],
        "created_at": order.created_at,
        "delivered_at": order.delivered_at,
    }


# ── CONFIRM OTP ───────────────────────────────────────────────
@router.post("/{order_id}/confirm-otp")
def confirm_otp(
    order_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == current_user.id,
    ).first()

    if not order:
        raise HTTPException(404, "Commande non trouvée")

    if order.otp_confirmed:
        raise HTTPException(400, "Commande déjà confirmée")

    if not verify_otp(order_id, payload["otp_code"]):
        raise HTTPException(400, "Code OTP incorrect ou expiré")

    order.otp_confirmed = True
    order.status = models.OrderStatus.DELIVERED
    order.delivered_at = datetime.utcnow()
    db.commit()

    return {
        "message": "Livraison confirmée !",
        "order_number": order.order_number,
        "delivered_at": order.delivered_at,
    }


# ── CANCEL ORDER ──────────────────────────────────────────────
@router.post("/{order_id}/cancel")
def cancel_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == current_user.id,
    ).first()

    if not order:
        raise HTTPException(404, "Commande non trouvée")

    if order.status not in [
        models.OrderStatus.PENDING,
        models.OrderStatus.CONFIRMED,
    ]:
        raise HTTPException(400, "Commande ne peut plus être annulée")

    order.status = models.OrderStatus.CANCELLED

    # Restore stock
    for item in order.items:
        stock = db.query(models.Stock).filter(
            models.Stock.pharmacy_id == order.pharmacy_id,
            models.Stock.medicine_id == item.medicine_id,
        ).first()
        if stock:
            stock.quantity += item.quantity

    db.commit()
    return {"message": "Commande annulée"}
