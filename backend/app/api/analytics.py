from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.analytics_service import (
    build_analytics_summary
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/summary")
def analytics_summary(
    db: Session = Depends(get_db)
):
    return build_analytics_summary(db)


@router.get("/kpis")
def analytics_kpis(
    db: Session = Depends(get_db)
):
    return build_analytics_summary(db)


@router.get("/risk")
def analytics_risk(
    db: Session = Depends(get_db)
):
    return build_analytics_summary(db)


@router.get("/goals")
def analytics_goals(
    db: Session = Depends(get_db)
):
    return build_analytics_summary(db)


@router.get("/debts")
def analytics_debts(
    db: Session = Depends(get_db)
):
    return build_analytics_summary(db)


@router.get("/cashflow")
def analytics_cashflow(
    db: Session = Depends(get_db)
):
    return build_analytics_summary(db)