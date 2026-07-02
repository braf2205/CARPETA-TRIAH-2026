from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.dashboard_service import build_dashboard


# =========================
# ROUTER
# =========================

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# =========================
# DASHBOARD EXECUTIVE
# =========================

@router.get("/")
def dashboard(
    db: Session = Depends(get_db)
):
    """
    Dashboard ejecutivo TRIAH.

    Consolida:
    - Ingresos
    - Gastos
    - Ahorro
    - Deudas
    - Metas
    - Empresas
    - Households
    - Risk Engine V2
    - Recomendaciones financieras
    """

    return build_dashboard(db)


# =========================
# DASHBOARD HEALTH
# =========================

@router.get("/health")
def dashboard_health():
    """
    Health check específico del módulo Dashboard.
    """

    return {
        "status": "ok",
        "module": "dashboard",
        "message": "Dashboard service funcionando correctamente"
    }