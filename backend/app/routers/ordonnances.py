from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from datetime import datetime
import boto3
import uuid
from app.database import get_db
from app import models
from app.config import settings
from app.utils.security import get_current_user, require_admin

router = APIRouter()


def upload_to_s3(file: UploadFile, user_id: str) -> str:
    """Upload ordonnance to Cloudflare R2 / S3 — chiffrement AES256."""
    s3 = boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint,
        aws_access_key_id=settings.s3_access_key_id,
        aws_secret_access_key=settings.s3_secret_access_key,
    )
    file_key = f"ordonnances/{user_id}/{uuid.uuid4()}-{file.filename}"
    s3.upload_fileobj(
        file.file,
        settings.s3_bucket,
        file_key,
        ExtraArgs={
            "ContentType": file.content_type,
            "ServerSideEncryption": "AES256",
        },
    )
    return f"{settings.s3_endpoint}/{settings.s3_bucket}/{file_key}"


# ── UPLOAD ORDONNANCE ─────────────────────────────────────────
@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_ordonnance(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    allowed_types = ["application/pdf", "image/jpeg", "image/png"]
    if file.content_type not in allowed_types:
        raise HTTPException(400, "Format non supporté. PDF, JPEG ou PNG uniquement.")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(400, "Fichier trop volumineux (max 5MB)")
    await file.seek(0)

    try:
        file_url = upload_to_s3(file, current_user.id)
    except Exception as e:
        raise HTTPException(500, f"Erreur upload: {str(e)}")

    ordonnance = models.Ordonnance(
        user_id=current_user.id,
        file_url=file_url,
        verified=False,
    )
    db.add(ordonnance)
    db.commit()
    db.refresh(ordonnance)

    return {
        "id": ordonnance.id,
        "file_url": ordonnance.file_url,
        "verified": ordonnance.verified,
        "created_at": ordonnance.created_at,
        "message": "Ordonnance téléversée — en attente de vérification ONMC",
    }


# ── GET MY ORDONNANCES ────────────────────────────────────────
@router.get("/my")
def get_my_ordonnances(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    ordonnances = db.query(models.Ordonnance).filter(
        models.Ordonnance.user_id == current_user.id
    ).order_by(models.Ordonnance.created_at.desc()).all()

    return [
        {
            "id": o.id,
            "verified": o.verified,
            "prescriber_onmc": o.prescriber_onmc,
            "delivery_date": o.delivery_date,
            "created_at": o.created_at,
        }
        for o in ordonnances
    ]


# ── VERIFY ORDONNANCE (Admin) ─────────────────────────────────
@router.post("/{ordonnance_id}/verify")
def verify_ordonnance(
    ordonnance_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    ordonnance = db.query(models.Ordonnance).filter(
        models.Ordonnance.id == ordonnance_id
    ).first()

    if not ordonnance:
        raise HTTPException(404, "Ordonnance non trouvée")

    ordonnance.verified = payload.get("verified", False)
    ordonnance.prescriber_onmc = payload.get("prescriber_onmc")
    ordonnance.verified_by = admin.id
    ordonnance.verified_at = datetime.utcnow()
    db.commit()

    return {
        "message": "Ordonnance vérifiée",
        "verified": ordonnance.verified,
        "prescriber_onmc": ordonnance.prescriber_onmc,
    }


# ── DELETE ORDONNANCE (RGPD) ──────────────────────────────────
@router.delete("/{ordonnance_id}")
def delete_ordonnance(
    ordonnance_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    ordonnance = db.query(models.Ordonnance).filter(
        models.Ordonnance.id == ordonnance_id,
        models.Ordonnance.user_id == current_user.id,
    ).first()

    if not ordonnance:
        raise HTTPException(404, "Ordonnance non trouvée")

    db.delete(ordonnance)
    db.commit()

    return {"message": "Ordonnance supprimée (Loi N°2024/017)"}
