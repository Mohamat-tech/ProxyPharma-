from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app import models
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter()


# ── REGISTER ──────────────────────────────────────────────────
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: dict, db: Session = Depends(get_db)):
    # Check email unique
    if db.query(models.User).filter(
        models.User.email == payload["email"]
    ).first():
        raise HTTPException(400, "Email déjà utilisé")

    # Check phone unique
    if db.query(models.User).filter(
        models.User.phone == payload["phone"]
    ).first():
        raise HTTPException(400, "Numéro déjà utilisé")

    # GDPR consent required
    if not payload.get("gdpr_consent"):
        raise HTTPException(400, "Le consentement RGPD est obligatoire")

    user = models.User(
        name=payload["name"],
        email=payload["email"],
        phone=payload["phone"],
        hashed_password=hash_password(payload["password"]),
        gdpr_consent=True,
        gdpr_consent_date=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "role": user.role,
    }


# ── LOGIN ─────────────────────────────────────────────────────
@router.post("/login")
def login(payload: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.phone == payload["phone"]
    ).first()

    if not user or not verify_password(payload["password"], user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Numéro ou mot de passe incorrect",
        )

    if not user.is_active:
        raise HTTPException(400, "Compte désactivé")

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "name": user.name,
        "role": user.role,
    }


# ── ME ────────────────────────────────────────────────────────
@router.get("/me")
def me(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
    }


# ── UPDATE PROFILE ────────────────────────────────────────────
@router.put("/me")
def update_profile(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if "name" in payload:
        current_user.name = payload["name"]
    if "address" in payload:
        current_user.address = payload["address"]
    if "password" in payload:
        current_user.hashed_password = hash_password(payload["password"])

    db.commit()
    db.refresh(current_user)
    return {"message": "Profil mis à jour"}


# ── DELETE ACCOUNT (RGPD) ─────────────────────────────────────
@router.delete("/me")
def delete_account(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    current_user.is_active = False
    current_user.email = f"deleted_{current_user.id}@proxypharma.cm"
    current_user.name = "Utilisateur supprimé"
    db.commit()
    return {"message": "Compte supprimé — données anonymisées (Loi N°2024/017)"}
