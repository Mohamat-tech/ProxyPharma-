from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
import math
from app.database import get_db
from app import models
from app.utils.security import get_current_user, require_admin

router = APIRouter()


def haversine(lat1, lng1, lat2, lng2) -> float:
    """Distance en km entre deux coordonnées GPS."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat/2)**2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlng/2)**2)
    return R * 2 * math.asin(math.sqrt(a))


# ── LIST PHARMACIES ───────────────────────────────────────────
@router.get("/")
def list_pharmacies(
    city: Optional[str] = None,
    open_only: bool = False,
    guard_only: bool = False,
    certified_only: bool = False,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius_km: float = 5.0,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(models.Pharmacy).filter(
        models.Pharmacy.is_active == True
    )

    if city:
        query = query.filter(models.Pharmacy.city.ilike(f"%{city}%"))
    if open_only:
        query = query.filter(models.Pharmacy.is_open == True)
    if guard_only:
        query = query.filter(models.Pharmacy.is_guard == True)
    if certified_only:
        query = query.filter(models.Pharmacy.dpml_certified == True)

    pharmacies = query.offset(skip).limit(limit).all()

    results = []
    for p in pharmacies:
        distance = None
        if lat and lng:
            distance = haversine(lat, lng, p.latitude, p.longitude)
            if distance > radius_km:
                continue

        results.append({
            "id": p.id,
            "name": p.name,
            "address": p.address,
            "city": p.city,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "phone": p.phone,
            "onpc_number": p.onpc_number,
            "dpml_certified": p.dpml_certified,
            "is_open": p.is_open,
            "is_guard": p.is_guard,
            "opening_hours": p.opening_hours,
            "rating": p.rating,
            "review_count": p.review_count,
            "distance_km": round(distance, 2) if distance else None,
        })

    if lat and lng:
        results.sort(key=lambda x: x["distance_km"] or 999)

    return {"total": len(results), "results": results}


# ── GET PHARMACY BY ID ────────────────────────────────────────
@router.get("/{pharmacy_id}")
def get_pharmacy(pharmacy_id: str, db: Session = Depends(get_db)):
    pharmacy = db.query(models.Pharmacy).filter(
        models.Pharmacy.id == pharmacy_id,
        models.Pharmacy.is_active == True,
    ).first()

    if not pharmacy:
        raise HTTPException(404, "Pharmacie non trouvée")

    return {
        "id": pharmacy.id,
        "name": pharmacy.name,
        "address": pharmacy.address,
        "city": pharmacy.city,
        "latitude": pharmacy.latitude,
        "longitude": pharmacy.longitude,
        "phone": pharmacy.phone,
        "email": pharmacy.email,
        "onpc_number": pharmacy.onpc_number,
        "dpml_certified": pharmacy.dpml_certified,
        "is_open": pharmacy.is_open,
        "is_guard": pharmacy.is_guard,
        "opening_hours": pharmacy.opening_hours,
        "rating": pharmacy.rating,
        "review_count": pharmacy.review_count,
    }


# ── GET PHARMACY STOCK ────────────────────────────────────────
@router.get("/{pharmacy_id}/stock")
def get_pharmacy_stock(
    pharmacy_id: str,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
):
    pharmacy = db.query(models.Pharmacy).filter(
        models.Pharmacy.id == pharmacy_id
    ).first()

    if not pharmacy:
        raise HTTPException(404, "Pharmacie non trouvée")

    stocks = db.query(models.Stock).filter(
        models.Stock.pharmacy_id == pharmacy_id,
        models.Stock.quantity > 0,
    ).all()

    results = []
    for s in stocks:
        if q and q.lower() not in s.medicine.name.lower():
            continue
        results.append({
            "medicine_id": s.medicine_id,
            "medicine_name": s.medicine.name,
            "dci": s.medicine.dci,
            "cpnn_code": s.medicine.cpnn_code,
            "requires_prescription": s.medicine.requires_prescription,
            "quantity": s.quantity,
            "price": s.price,
        })

    return {"pharmacy": pharmacy.name, "stock": results}


# ── NEAREST PHARMACY WITH STOCK ───────────────────────────────
@router.get("/nearest/with-stock")
def nearest_pharmacy_with_stock(
    medicine_id: str,
    lat: float,
    lng: float,
    db: Session = Depends(get_db),
):
    stocks = db.query(models.Stock).filter(
        models.Stock.medicine_id == medicine_id,
        models.Stock.quantity > 0,
    ).all()

    results = []
    for s in stocks:
        p = s.pharmacy
        if not p.is_active or not p.is_open:
            continue
        dist = haversine(lat, lng, p.latitude, p.longitude)
        results.append({
            "pharmacy_id": p.id,
            "pharmacy_name": p.name,
            "address": p.address,
            "phone": p.phone,
            "dpml_certified": p.dpml_certified,
            "price": s.price,
            "quantity": s.quantity,
            "distance_km": round(dist, 2),
        })

    results.sort(key=lambda x: x["distance_km"])
    return {"nearest": results[:5]}
