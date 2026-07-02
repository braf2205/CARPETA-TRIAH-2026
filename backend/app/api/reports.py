from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.report_service import build_executive_report


router = APIRouter(
    prefix="/reports",
    tags=["Executive Reports"]
)


@router.get("/executive-json")
def executive_report_json(
    db: Session = Depends(get_db)
):
    return build_executive_report(db)


@router.get("/health")
def reports_health():
    return {
        "status": "ok",
        "module": "executive_reports",
        "message": "Executive Reports funcionando correctamente"
    }