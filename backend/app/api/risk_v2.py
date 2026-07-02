from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.household import Household
from app.models.transaction import Transaction
from app.models.debt import Debt
from app.models.goal import Goal
from app.services.risk_engine import calculate_financial_score

router = APIRouter(
    prefix="/risk-v2",
    tags=["Risk Engine V2"]
)


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


@router.get("/household/{household_id}")
def household_health_score(
    household_id: int,
    db: Session = Depends(get_db)
):
    household = db.query(Household).filter(Household.id == household_id).first()

    if not household:
        return {
            "error": "Household not found",
            "household_id": household_id
        }

    transactions = db.query(Transaction).filter(
        Transaction.household_id == household_id
    ).all()

    debts = db.query(Debt).all()

    goals = db.query(Goal).filter(
        Goal.household_id == household_id
    ).all()

    income_from_transactions = sum(
        float(t.amount or 0)
        for t in transactions
        if str(t.type).lower() == "income"
    )

    expenses_from_transactions = sum(
        float(t.amount or 0)
        for t in transactions
        if str(t.type).lower() == "expense"
    )

    monthly_income = income_from_transactions or float(household.monthly_income or 0)
    monthly_expenses = expenses_from_transactions or float(household.monthly_expenses or 0)
    savings = monthly_income - monthly_expenses

    monthly_debt_payment = sum(
        float(d.monthly_payment or 0)
        for d in debts
    )

    total_goal_target = sum(
        float(g.target_amount or 0)
        for g in goals
    )

    total_goal_current = sum(
        float(g.current_amount or 0)
        for g in goals
    )

    goals_progress = (
        (total_goal_current / total_goal_target) * 100
        if total_goal_target > 0
        else 0
    )

    result = calculate_financial_score(
        monthly_income=monthly_income,
        monthly_expenses=monthly_expenses,
        savings=savings,
        monthly_debt_payment=monthly_debt_payment,
        goals_progress=goals_progress,
        education_progress=70,
    )

    result["household"] = {
        "id": household.id,
        "name": household.name,
        "country": household.country,
        "currency": household.currency,
        "members": household.members,
    }

    result["financial_summary"] = {
        "monthly_income": monthly_income,
        "monthly_expenses": monthly_expenses,
        "savings": savings,
        "monthly_debt_payment": monthly_debt_payment,
        "goals_progress": round(goals_progress, 2),
    }

    return result