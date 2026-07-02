from sqlalchemy.orm import Session

from app.services.analytics_service import build_analytics_summary
from app.services.risk_engine import calculate_financial_score


def build_recommendations(
    current_score: float,
    simulated_score: float,
    income_change_pct: float,
    expense_change_pct: float,
    extra_savings_pct: float,
    payoff_debt: bool,
):
    recommendations = []

    if simulated_score > current_score:
        recommendations.append("El escenario mejora la salud financiera proyectada.")
    elif simulated_score < current_score:
        recommendations.append("El escenario deteriora la salud financiera proyectada.")
    else:
        recommendations.append("El escenario mantiene estable la salud financiera.")

    if income_change_pct < 0:
        recommendations.append("Preparar un fondo de emergencia ante reducción de ingresos.")

    if expense_change_pct > 0:
        recommendations.append("Controlar gastos variables para evitar presión sobre la liquidez.")

    if extra_savings_pct > 0:
        recommendations.append("El aumento del ahorro fortalece la liquidez y la capacidad de cumplir metas.")

    if payoff_debt:
        recommendations.append("Pagar deuda reduce presión mensual y mejora la capacidad financiera.")

    recommendations.append(
        "Estas simulaciones son educativas y no constituyen asesoría financiera, legal, tributaria ni de inversión."
    )

    return recommendations


def simulate_financial_twin(
    db: Session,
    income_change_pct: float = 0,
    expense_change_pct: float = 0,
    extra_savings_pct: float = 0,
    payoff_debt: bool = False,
):
    analytics = build_analytics_summary(db)

    current_income = float(analytics.get("income", 0) or 0)
    current_expenses = float(analytics.get("expenses", 0) or 0)
    current_savings = float(analytics.get("savings", 0) or 0)
    current_monthly_debt_payment = float(
        analytics.get("monthly_debt_payment", 0) or 0
    )
    current_goal_progress = float(analytics.get("goal_progress", 0) or 0)
    current_score = float(analytics.get("financial_score", 0) or 0)
    current_risk_level = analytics.get("risk_level", "Sin clasificar")

    simulated_income = current_income * (1 + income_change_pct / 100)
    simulated_expenses = current_expenses * (1 + expense_change_pct / 100)

    simulated_savings = simulated_income - simulated_expenses

    if extra_savings_pct > 0:
        simulated_savings = simulated_savings * (1 + extra_savings_pct / 100)

    simulated_monthly_debt_payment = (
        0
        if payoff_debt
        else current_monthly_debt_payment
    )

    simulated_risk = calculate_financial_score(
        monthly_income=simulated_income,
        monthly_expenses=simulated_expenses,
        savings=simulated_savings,
        monthly_debt_payment=simulated_monthly_debt_payment,
        goals_progress=current_goal_progress,
        education_progress=70,
    )

    simulated_score = float(simulated_risk.get("score", 0) or 0)
    simulated_risk_level = simulated_risk.get("level", "Sin clasificar")

    return {
        "scenario": {
            "income_change_pct": income_change_pct,
            "expense_change_pct": expense_change_pct,
            "extra_savings_pct": extra_savings_pct,
            "payoff_debt": payoff_debt,
        },
        "current_state": {
            "income": current_income,
            "expenses": current_expenses,
            "savings": current_savings,
            "monthly_debt_payment": current_monthly_debt_payment,
            "goal_progress": current_goal_progress,
            "financial_score": current_score,
            "risk_level": current_risk_level,
        },
        "simulated_state": {
            "income": round(simulated_income, 2),
            "expenses": round(simulated_expenses, 2),
            "savings": round(simulated_savings, 2),
            "monthly_debt_payment": round(simulated_monthly_debt_payment, 2),
            "goal_progress": current_goal_progress,
            "financial_score": simulated_score,
            "risk_level": simulated_risk_level,
            "risk_components": simulated_risk.get("components", {}),
            "risks": simulated_risk.get("risks", []),
        },
        "score_difference": round(simulated_score - current_score, 2),
        "risk_difference": {
            "from": current_risk_level,
            "to": simulated_risk_level,
        },
        "recommendations": build_recommendations(
            current_score=current_score,
            simulated_score=simulated_score,
            income_change_pct=income_change_pct,
            expense_change_pct=expense_change_pct,
            extra_savings_pct=extra_savings_pct,
            payoff_debt=payoff_debt,
        ),
    }