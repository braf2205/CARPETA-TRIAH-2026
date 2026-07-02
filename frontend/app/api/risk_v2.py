from fastapi import APIRouter

from app.services.risk_engine import calculate_financial_score

router = APIRouter(prefix="/risk-v2", tags=["Risk Engine V2"])


@router.get("/health-score")
def health_score():
    return calculate_financial_score(
        monthly_income=15000000,
        monthly_expenses=9000000,
        savings=6000000,
        monthly_debt_payment=850000,
        goals_progress=19.15,
        education_progress=70,
    )