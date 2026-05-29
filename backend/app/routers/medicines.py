from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional
from app.database import get_db
from app import models

router = APIRouter()


# ── SEARCH MEDICINES ──────────────────────────────────────────
@router.get("/search")
def search_medicines(
    q: Optional[str] = Query(None, description="Nom, DCI ou pathologie"),
    category: Optional[str] = None,
    requires_prescription: Optional[bool] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(models.Medicine).filter(
        models.Medicine.amm_valid == True
    )

    if q:
        query = query.filter(
            or_(
                models.Medicine.name.ilike(f"%{q}%"),
                models.Medicine.dci.ilike(f"%{q}%"),
                models.Medicine.brand.ilike(f"%{q}%"),
                models.Medicine.indication.ilike(f"%{q}%"),
                models.Medicine.category.ilike(f"%{q}%"),
            )
        )

    if category:
        query = query.filter(
            models.Medicine.category.ilike(f"%{category}%")
        )

    if requires_prescription is not None:
        query = query.filter(
            models.Medicine.requires_prescription == requires_prescription
        )

    total = query.count()
    medicines = query.offset(skip).limit(limit).all()

    results = []
    for med in medicines:
        # Count available pharmacies
        stocks = db.query(models.Stock).filter(
            models.Stock.medicine_id == med.id,
            models.Stock.quantity > 0,
        ).all()

        prices = [s.price for s in stocks]
        results.append({
            "id": med.id,
            "name": med.name,
            "dci": med.dci,
            "brand": med.brand,
            "cpnn_code": med.cpnn_code,
            "category": med.category,
            "requires_prescription": med.requires_prescription,
            "amm_valid": med.amm_valid,
            "available_pharmacies": len(stocks),
            "min_price": min(prices) if prices else None,
            "max_price": max(prices) if prices else None,
        })

    return {
        "total": total,
        "results": results,
        "skip": skip,
        "limit": limit,
    }


# ── GET MEDICINE BY ID ────────────────────────────────────────
@router.get("/{medicine_id}")
def get_medicine(medicine_id: str, db: Session = Depends(get_db)):
    med = db.query(models.Medicine).filter(
        models.Medicine.id == medicine_id,
        models.Medicine.amm_valid == True,
    ).first()

    if not med:
        raise HTTPException(404, "Médicament non trouvé")

    return {
        "id": med.id,
        "name": med.name,
        "dci": med.dci,
        "brand": med.brand,
        "cpnn_code": med.cpnn_code,
        "category": med.category,
        "description": med.description,
        "indication": med.indication,
        "posology": med.posology,
        "side_effects": med.side_effects,
        "contraindications": med.contraindications,
        "requires_prescription": med.requires_prescription,
        "amm_valid": med.amm_valid,
        "amm_number": med.amm_number,
    }


# ── GET STOCKS BY MEDICINE ────────────────────────────────────
@router.get("/{medicine_id}/stocks")
def get_medicine_stocks(
    medicine_id: str,
    city: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    db: Session = Depends(get_db),
):
    med = db.query(models.Medicine).filter(
        models.Medicine.id == medicine_id
    ).first()

    if not med:
        raise HTTPException(404, "Médicament non trouvé")

    query = db.query(models.Stock).filter(
        models.Stock.medicine_id == medicine_id,
        models.Stock.quantity > 0,
    )

    stocks = query.all()
    results = []

    for stock in stocks:
        pharmacy = stock.pharmacy
        if not pharmacy.is_active:
            continue
        if city and pharmacy.city.lower() != city.lower():
            continue

        # Calculate distance if coords provided
        distance = None
        if lat and lng:
            # Haversine approximation (km)
            import math
            R = 6371
            dlat = math.radians(pharmacy.latitude - lat)
            dlng = math.radians(pharmacy.longitude - lng)
            a = (math.sin(dlat/2)**2 +
                 math.cos(math.radians(lat)) *
                 math.cos(math.radians(pharmacy.latitude)) *
                 math.sin(dlng/2)**2)
            distance = R * 2 * math.asin(math.sqrt(a))

        results.append({
            "pharmacy_id": pharmacy.id,
            "pharmacy_name": pharmacy.name,
            "pharmacy_address": pharmacy.address,
            "pharmacy_city": pharmacy.city,
            "pharmacy_phone": pharmacy.phone,
            "dpml_certified": pharmacy.dpml_certified,
            "is_open": pharmacy.is_open,
            "is_guard": pharmacy.is_guard,
            "rating": pharmacy.rating,
            "quantity": stock.quantity,
            "price": stock.price,
            "distance_km": round(distance, 2) if distance else None,
        })

    # Sort by price
    results.sort(key=lambda x: x["price"])

    return {"medicine": med.name, "stocks": results}


# ── GET CATEGORIES ────────────────────────────────────────────
@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(
        models.Medicine.category,
        func.count(models.Medicine.id).label("count")
    ).group_by(models.Medicine.category).all()

    return [{"category": c, "count": n} for c, n in categories]
