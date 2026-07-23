from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.models.goal import Goal
from app.models.debt import Debt
from app.models.company import Company
from app.models.household import Household
from app.services.executive_service import build_executive_intelligence
from app.services.twin_service import build_financial_twin
from app.services.risk_engine import calculate_financial_score


# =====================================================
# HELPERS
# =====================================================

def safe_sum(items, field):
    return sum(
        (getattr(item, field, 0) or 0)
        for item in items
    )


def percentage(part, total):
    if total <= 0:
        return 0

    return round((part / total) * 100, 2)


def safe_ratio(numerator, denominator):
    if denominator <= 0:
        return 0

    return round(numerator / denominator, 2)


# =====================================================
# DASHBOARD BUILDER
# =====================================================

def build_dashboard(db: Session):

    # =================================================
    # LOAD DATA
    # =================================================

    households = db.query(Household).all()
    transactions = db.query(Transaction).all()
    debts = db.query(Debt).all()
    goals = db.query(Goal).all()
    companies = db.query(Company).all()

    # =================================================
    # FINANCIALS
    # =================================================

    income = sum(
        t.amount or 0
        for t in transactions
        if t.type == "income"
    )

    expenses = sum(
        t.amount or 0
        for t in transactions
        if t.type == "expense"
    )

    savings = income - expenses

    # =================================================
    # DEBTS
    # =================================================

    total_debt = safe_sum(
        debts,
        "amount"
    )

    monthly_debt_payment = safe_sum(
        debts,
        "monthly_payment"
    )

    # =================================================
    # GOALS
    # =================================================

    total_goals = safe_sum(
        goals,
        "target_amount"
    )

    current_goals = safe_sum(
        goals,
        "current_amount"
    )

    goal_progress_percentage = percentage(
        current_goals,
        total_goals
    )

    # =================================================
    # SAVINGS
    # =================================================

    savings_rate = percentage(
        savings,
        income
    )

    debt_ratio = percentage(
        monthly_debt_payment,
        income
    )

    liquidity_ratio = safe_ratio(
        savings,
        expenses
    )

    # =================================================
    # RISK ENGINE V2
    # =================================================

    risk_result = calculate_financial_score(
        monthly_income=income,
        monthly_expenses=expenses,
        savings=savings,
        monthly_debt_payment=monthly_debt_payment,
        goals_progress=goal_progress_percentage,
        education_progress=70
    )

    # =================================================
    # COMPANY ANALYTICS
    # =================================================

    total_companies = len(companies)

    total_company_revenue = safe_sum(
        companies,
        "annual_revenue"
    )

    total_company_monthly_expenses = safe_sum(
        companies,
        "monthly_expenses"
    )

    company_margin = (
        percentage(
            total_company_revenue
            - (total_company_monthly_expenses * 12),
            total_company_revenue
        )
        if total_company_revenue > 0
        else 0
    )

     # =================================================
    # EXECUTIVE KPI
    # =================================================

    financial_health_score = risk_result["score"]

    # =================================================
    # EXECUTIVE SUMMARY
    # =================================================

    executive_summary = {

        "monthly_income":
            income,

        "monthly_expenses":
            expenses,

        "monthly_savings":
            savings,

        "savings_rate":
            savings_rate,

        "debt_ratio":
            debt_ratio,

        "goal_progress":
            goal_progress_percentage,

        "financial_health_score":
            financial_health_score,

        "risk_level":
            risk_result["level"]
    }

    # =================================================
    # DASHBOARD PAYLOAD
    # =================================================

    dashboard_payload = {

        # ---------------------------------------------
        # RESUMEN EJECUTIVO
        # ---------------------------------------------

        "executive_summary":
            executive_summary,

        # ---------------------------------------------
        # HOGARES
        # ---------------------------------------------

        "total_households":
            len(households),

        # ---------------------------------------------
        # INGRESOS
        # ---------------------------------------------

        "income":
            income,

        "expenses":
            expenses,

        "savings":
            savings,

        "savings_rate":
            savings_rate,

        # ---------------------------------------------
        # DEUDAS
        # ---------------------------------------------

        "total_debt":
            total_debt,

        "monthly_debt_payment":
            monthly_debt_payment,

        "debt_ratio":
            debt_ratio,

        # ---------------------------------------------
        # METAS
        # ---------------------------------------------

        "total_goals":
            total_goals,

        "current_goals":
            current_goals,

        "goal_progress_percentage":
            goal_progress_percentage,

        # ---------------------------------------------
        # LIQUIDEZ
        # ---------------------------------------------

        "liquidity_ratio":
            liquidity_ratio,

        # ---------------------------------------------
        # SCORE
        # ---------------------------------------------

        "financial_score":
            risk_result["score"],

        "risk_level":
            risk_result["level"],

        "risk_components":
            risk_result["components"],

        "risks":
            risk_result["risks"],

        "recommendations":
            risk_result["recommendations"],

        # ---------------------------------------------
        # EMPRESAS
        # ---------------------------------------------

        "total_companies":
            total_companies,

        "total_company_revenue":
            total_company_revenue,

        "total_company_monthly_expenses":
            total_company_monthly_expenses,

        "company_margin":
            company_margin
    }

    # =================================================
    # EXECUTIVE INTELLIGENCE
    # =================================================

    dashboard_payload["executive_intelligence"] = (
        build_executive_intelligence(dashboard_payload)
    )
        # =================================================
    # FINANCIAL TWIN INTELLIGENCE
    # =================================================

    dashboard_payload["financial_twin_intelligence"] = (
        build_financial_twin(dashboard_payload)
    )

    # =================================================
    # RETURN
    # =================================================

    return dashboard_payload