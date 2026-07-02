from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.financial_twin_service import simulate_financial_twin


router = APIRouter(
    prefix="/twin",
    tags=["Financial Twin"]
)


@router.get("/scenario")
def twin_scenario(
    income_change_pct: float = Query(
        0,
        description="Cambio porcentual de ingresos. Ejemplo: -30 reduce ingresos 30%"
    ),
    expense_change_pct: float = Query(
        0,
        description="Cambio porcentual de gastos. Ejemplo: 20 aumenta gastos 20%"
    ),
    extra_savings_pct: float = Query(
        0,
        description="Incremento porcentual del ahorro disponible"
    ),
    payoff_debt: bool = Query(
        False,
        description="Simula pago total de deuda mensual"
    ),
    db: Session = Depends(get_db),
):
    return simulate_financial_twin(
        db=db,
        income_change_pct=income_change_pct,
        expense_change_pct=expense_change_pct,
        extra_savings_pct=extra_savings_pct,
        payoff_debt=payoff_debt,
    )


@router.get("/health")
def twin_health():
    return {
        "status": "ok",
        "module": "financial_twin",
        "message": "Financial Twin Engine funcionando correctamente"
    }