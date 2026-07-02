from math import ceil
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.goal import Goal
from app.models.debt import Debt
from app.services.analytics_service import build_analytics_summary


def safe_sum(items, field):
    return sum(float(getattr(item, field, 0) or 0) for item in items)


def forecast_savings(db: Session):
    analytics = build_analytics_summary(db)

    monthly_savings = float(analytics.get("savings", 0) or 0)

    return {
        "monthly_savings": monthly_savings,
        "forecast": {
            "3_months": monthly_savings * 3,
            "6_months": monthly_savings * 6,
            "12_months": monthly_savings * 12,
            "24_months": monthly_savings * 24,
        },
        "scenarios": {
            "conservative": {
                "monthly_savings": monthly_savings * 0.75,
                "12_months": monthly_savings * 0.75 * 12,
            },
            "base": {
                "monthly_savings": monthly_savings,
                "12_months": monthly_savings * 12,
            },
            "optimistic": {
                "monthly_savings": monthly_savings * 1.25,
                "12_months": monthly_savings * 1.25 * 12,
            },
        },
    }


def forecast_goals(db: Session):
    analytics = build_analytics_summary(db)
    goals = db.query(Goal).all()

    monthly_savings = float(analytics.get("savings", 0) or 0)

    results = []

    for goal in goals:
        target_amount = float(goal.target_amount or 0)
        current_amount = float(goal.current_amount or 0)
        remaining_amount = max(target_amount - current_amount, 0)

        months_to_complete = (
            ceil(remaining_amount / monthly_savings)
            if monthly_savings > 0 and remaining_amount > 0
            else 0
        )

        results.append(
            {
                "id": goal.id,
                "title": goal.title,
                "target_amount": target_amount,
                "current_amount": current_amount,
                "remaining_amount": remaining_amount,
                "months_to_complete": months_to_complete,
                "status": (
                    "completed"
                    if remaining_amount == 0
                    else "in_progress"
                ),
            }
        )

    return {
        "monthly_savings_available": monthly_savings,
        "goals": results,
    }


def forecast_debts(db: Session):
    debts = db.query(Debt).all()

    results = []

    for debt in debts:
        amount = float(debt.amount or 0)
        monthly_payment = float(debt.monthly_payment or 0)

        months_to_payoff = (
            ceil(amount / monthly_payment)
            if monthly_payment > 0 and amount > 0
            else 0
        )

        results.append(
            {
                "id": debt.id,
                "name": debt.name,
                "amount": amount,
                "monthly_payment": monthly_payment,
                "interest_rate": float(debt.interest_rate or 0),
                "months_to_payoff": months_to_payoff,
            }
        )

    return {
        "debts": results,
    }


def forecast_financial_health(db: Session):
    analytics = build_analytics_summary(db)

    current_score = float(analytics.get("financial_score", 0) or 0)
    savings_rate = float(analytics.get("savings_rate", 0) or 0)
    goal_progress = float(analytics.get("goal_progress", 0) or 0)
    debt_ratio = float(analytics.get("debt_ratio", 0) or 0)

    improvement_factor = 0

    if savings_rate >= 20:
        improvement_factor += 1.5

    if debt_ratio < 30:
        improvement_factor += 1

    if goal_progress >= 30:
        improvement_factor += 1

    return {
        "current_score": current_score,
        "projected_score": {
            "3_months": min(round(current_score + improvement_factor, 2), 100),
            "6_months": min(round(current_score + improvement_factor * 2, 2), 100),
            "12_months": min(round(current_score + improvement_factor * 4, 2), 100),
            "24_months": min(round(current_score + improvement_factor * 8, 2), 100),
        },
    }


def build_forecast_summary(db: Session):
    return {
        "savings_forecast": forecast_savings(db),
        "goals_forecast": forecast_goals(db),
        "debts_forecast": forecast_debts(db),
        "financial_health_forecast": forecast_financial_health(db),
        "disclaimer": (
            "Estas proyecciones son estimaciones educativas basadas en los datos registrados. "
            "No constituyen asesoría financiera, legal, tributaria ni de inversión."
        ),
    }