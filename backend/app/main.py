from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from loguru import logger

from app.config import settings
from app.database import Base, engine
from app.routers import auth, medicines, pharmacies, orders, ordonnances

# Create tables
Base.metadata.create_all(bind=engine)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API de recherche et livraison de médicaments — Douala & Yaoundé",
    docs_url="/docs" if settings.app_env == "development" else None,
)

# ── Middleware ────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────
app.include_router(auth.router,        prefix="/api/v1/auth",        tags=["Auth"])
app.include_router(medicines.router,   prefix="/api/v1/medicines",   tags=["Medicines"])
app.include_router(pharmacies.router,  prefix="/api/v1/pharmacies",  tags=["Pharmacies"])
app.include_router(orders.router,      prefix="/api/v1/orders",      tags=["Orders"])
app.include_router(ordonnances.router, prefix="/api/v1/ordonnances", tags=["Ordonnances"])

# ── Health check ──────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "version": settings.app_version,
        "env": settings.app_env,
    }

logger.info(f"ProxyPharma API started — env={settings.app_env}")
