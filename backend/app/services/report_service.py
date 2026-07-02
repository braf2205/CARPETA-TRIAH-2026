from sqlalchemy.orm import Session

from app.services.dashboard_service import build_dashboard
from app.services.analytics_service import build_analytics_summary
from app.services.forecast_service import build_forecast_summary
from app.services.financial_twin_service import simulate_financial_twin


def build_action_plan(dashboard: dict):
    risk_level = dashboard.get("risk_level", "Sin clasificar")
    savings_rate = dashboard.get("savings_rate", 0)
    debt_ratio = dashboard.get("debt_ratio", 0)
    goal_progress = dashboard.get("goal_progress_percentage", 0)

    plan_30_days = []
    plan_90_days = []
    annual_plan = []

    if savings_rate < 20:
        plan_30_days.append("Revisar gastos variables y definir un ahorro automático mensual.")
    else:
        plan_30_days.append("Mantener el nivel actual de ahorro y documentar presupuesto mensual.")

    if debt_ratio > 30:
        plan_30_days.append("Priorizar deudas de mayor costo financiero.")
        plan_90_days.append("Diseñar estrategia de reducción de deuda y renegociación responsable.")
    else:
        plan_90_days.append("Mantener control del endeudamiento y evitar nuevas obligaciones innecesarias.")

    if goal_progress < 30:
        plan_90_days.append("Aumentar aportes a metas financieras prioritarias.")
        annual_plan.append("Construir un sistema de metas con seguimiento mensual.")
    else:
        annual_plan.append("Escalar metas hacia ahorro patrimonial y planeación de largo plazo.")

    if risk_level in ["Crítico", "Vulnerable"]:
        annual_plan.append("Fortalecer liquidez, fondo de emergencia y control de gastos.")
    else:
        annual_plan.append("Consolidar hábitos financieros y avanzar hacia planeación patrimonial.")

    return {
        "plan_30_days": plan_30_days,
        "plan_90_days": plan_90_days,
        "annual_plan": annual_plan,
    }


def build_executive_report(db: Session):
    dashboard = build_dashboard(db)
    analytics = build_analytics_summary(db)
    forecast = build_forecast_summary(db)

    base_twin = simulate_financial_twin(
        db=db,
        income_change_pct=0,
        expense_change_pct=0,
        extra_savings_pct=0,
        payoff_debt=False,
    )

    stress_twin = simulate_financial_twin(
        db=db,
        income_change_pct=-30,
        expense_change_pct=20,
        extra_savings_pct=0,
        payoff_debt=False,
    )

    improvement_twin = simulate_financial_twin(
        db=db,
        income_change_pct=10,
        expense_change_pct=-10,
        extra_savings_pct=15,
        payoff_debt=True,
    )

    action_plan = build_action_plan(dashboard)

    return {
        "report_name": "TRIAH Executive Financial Report",
        "version": "1.0.0",
        "report_type": "executive_json",

        "executive_summary": {
            "financial_score": dashboard.get("financial_score"),
            "risk_level": dashboard.get("risk_level"),
            "income": dashboard.get("income"),
            "expenses": dashboard.get("expenses"),
            "savings": dashboard.get("savings"),
            "savings_rate": dashboard.get("savings_rate"),
            "debt_ratio": dashboard.get("debt_ratio"),
            "goal_progress": dashboard.get("goal_progress_percentage"),
            "diagnosis": (
                "La salud financiera presenta una posición sólida."
                if dashboard.get("financial_score", 0) >= 75
                else "La salud financiera requiere seguimiento y acciones de mejora."
            ),
        },

        "dashboard": dashboard,
        "analytics": analytics,
        "forecast": forecast,

        "financial_twin": {
            "base_scenario": base_twin,
            "stress_scenario": stress_twin,
            "improvement_scenario": improvement_twin,
        },

        "risk_analysis": {
            "risk_level": dashboard.get("risk_level"),
            "risk_components": dashboard.get("risk_components"),
            "risks": dashboard.get("risks"),
            "recommendations": dashboard.get("recommendations"),
        },

        "action_plan": action_plan,

        "disclaimer": (
            "Este reporte es una herramienta educativa y de diagnóstico financiero. "
            "No constituye asesoría legal, tributaria, financiera ni de inversión definitiva."
        ),
    }