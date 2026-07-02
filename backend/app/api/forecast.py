from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.forecast_service import (
    forecast_savings,
    forecast_goals,
    forecast_debts,
    forecast_financial_health,
    build_forecast_summary,
)


router = APIRouter(
    prefix="/forecast",
    tags=["Forecast Engine"]
)


@router.get("/savings")
def get_savings_forecast(
    db: Session = Depends(get_db)
):
    return forecast_savings(db)


@router.get("/goals")
def get_goals_forecast(
    db: Session = Depends(get_db)
):
    return forecast_goals(db)


@router.get("/debts")
def get_debts_forecast(
    db: Session = Depends(get_db)
):
    return forecast_debts(db)


@router.get("/financial-health")
def get_financial_health_forecast(
    db: Session = Depends(get_db)
):
    return forecast_financial_health(db)


@router.get("/summary")
def get_forecast_summary(
    db: Session = Depends(get_db)
):
    return build_forecast_summary(db)