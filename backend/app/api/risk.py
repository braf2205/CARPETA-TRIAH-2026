from fastapi import APIRouter
from app.schemas.risk import RiskInput
from app.services.risk_engine import calculate_financial_score

router = APIRouter(prefix="/risk", tags=["Risk Engine"])


@router.post("/score")
def calculate_score(payload: RiskInput):
    return calculate_financial_score(
        monthly_income=payload.monthly_income,
        monthly_expenses=payload.monthly_expenses,
        savings=payload.savings,
        monthly_debt_payment=payload.monthly_debt_payment,
        goals_progress=payload.goals_progress,
        education_progress=payload.education_progress
    )
