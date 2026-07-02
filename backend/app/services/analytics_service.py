from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.goal import Goal
from app.models.debt import Debt
from app.models.company import Company
from app.models.household import Household

from app.services.risk_engine import (
    calculate_financial_score
)


# =====================================
# HELPERS
# =====================================

def safe_sum(items, field):
    return sum(
        (getattr(item, field, 0) or 0)
        for item in items
    )


def percentage(part, total):
    if not total or total <= 0:
        return 0

    return round(
        (part / total) * 100,
        2
    )


# =====================================
# ANALYTICS SUMMARY
# =====================================

def build_analytics_summary(
    db: Session
):

    transactions = db.query(Transaction).all()
    debts = db.query(Debt).all()
    goals = db.query(Goal).all()
    companies = db.query(Company).all()
    households = db.query(Household).all()

    income = sum(
        t.amount
        for t in transactions
        if t.type == "income"
    )

    expenses = sum(
        t.amount
        for t in transactions
        if t.type == "expense"
    )

    savings = income - expenses

    total_debt = safe_sum(
        debts,
        "amount"
    )

    monthly_debt_payment = safe_sum(
        debts,
        "monthly_payment"
    )

    total_goals = safe_sum(
        goals,
        "target_amount"
    )

    current_goals = safe_sum(
        goals,
        "current_amount"
    )

    goal_progress = percentage(
        current_goals,
        total_goals
    )

    savings_rate = percentage(
        savings,
        income
    )

    debt_ratio = percentage(
        monthly_debt_payment,
        income
    )

    liquidity_ratio = (
        round(savings / expenses, 2)
        if expenses > 0
        else 0
    )

    risk = calculate_financial_score(
        monthly_income=income,
        monthly_expenses=expenses,
        savings=savings,
        monthly_debt_payment=monthly_debt_payment,
        goals_progress=goal_progress,
        education_progress=70
    )

    return {

        "income": income,
        "expenses": expenses,
        "savings": savings,

        "savings_rate": savings_rate,

        "total_debt": total_debt,
        "monthly_debt_payment":
            monthly_debt_payment,

        "debt_ratio": debt_ratio,

        "total_goals": total_goals,
        "current_goals": current_goals,

        "goal_progress":
            goal_progress,

        "liquidity_ratio":
            liquidity_ratio,

        "financial_score":
            risk["score"],

        "risk_level":
            risk["level"],

        "risks":
            risk["risks"],

        "recommendations":
            risk["recommendations"],

        "total_households":
            len(households),

        "total_companies":
            len(companies),

        "total_company_revenue":
            safe_sum(
                companies,
                "annual_revenue"
            ),

        "total_company_monthly_expenses":
            safe_sum(
                companies,
                "monthly_expenses"
            )
    }