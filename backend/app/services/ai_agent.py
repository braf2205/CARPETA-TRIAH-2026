from typing import Dict, Any
from sqlalchemy.orm import Session

from app.services.dashboard_service import build_dashboard
from app.services.analytics_service import build_analytics_summary
from app.services.forecast_service import build_forecast_summary
from app.services.report_service import build_executive_report


OPENAI_ENABLED = False


def generate_financial_coach_response(
    question: str,
    dashboard: Dict[str, Any],
) -> Dict[str, Any]:
    income = dashboard.get("income", 0)
    expenses = dashboard.get("expenses", 0)
    savings = dashboard.get("savings", 0)
    savings_rate = dashboard.get("savings_rate", 0)
    debt_ratio = dashboard.get("debt_ratio", 0)
    total_debt = dashboard.get("total_debt", 0)
    goal_progress = dashboard.get("goal_progress_percentage", 0)
    liquidity_ratio = dashboard.get("liquidity_ratio", 0)
    financial_score = dashboard.get("financial_score", 0)
    risk_level = dashboard.get("risk_level", "No calculado")
    total_companies = dashboard.get("total_companies", 0)

    risks = []

    if savings_rate < 10:
        risks.append("La tasa de ahorro es baja frente al ingreso disponible.")

    if debt_ratio > 35:
        risks.append("El nivel de endeudamiento mensual puede presionar el flujo de caja.")

    if liquidity_ratio < 1:
        risks.append("La liquidez es limitada para cubrir gastos mensuales.")

    if goal_progress < 25:
        risks.append("El avance de metas financieras todavía es bajo.")

    if not risks:
        risks.append("No se observan alertas críticas inmediatas con los datos actuales.")

    return {
        "question": question,
        "financial_score": financial_score,
        "risk_level": risk_level,
        "family_diagnosis": {
            "income": income,
            "expenses": expenses,
            "savings": savings,
            "savings_rate": savings_rate,
            "liquidity_ratio": liquidity_ratio,
            "summary": (
                f"El hogar presenta un score financiero de "
                f"{financial_score}/100 y un nivel de riesgo {risk_level}."
            ),
        },
        "business_diagnosis": {
            "total_companies": total_companies,
            "summary": (
                "El módulo empresarial está activo. Para mejorar el diagnóstico, "
                "registra ingresos, costos y datos operativos de cada empresa."
            ),
        },
        "detected_risks": risks,
        "responsible_recommendations": [
            "Mantener un presupuesto mensual actualizado.",
            "Separar gastos fijos, variables y financieros.",
            "Priorizar fondo de emergencia antes de asumir nuevas obligaciones.",
            "Revisar deudas con mayor tasa de interés.",
            "Actualizar metas financieras con montos y fechas realistas.",
        ],
        "next_30_days": [
            "Registrar todos los ingresos y gastos del mes.",
            "Validar si el ahorro mensual es sostenible.",
            "Crear o actualizar mínimo una meta financiera.",
            "Revisar pagos mensuales de deuda.",
        ],
        "next_90_days": [
            "Construir un fondo de emergencia equivalente a 1 o 2 meses de gastos.",
            "Reducir gastos no esenciales si la tasa de ahorro baja.",
            "Definir metas familiares y empresariales separadas.",
            "Medir evolución del score financiero cada mes.",
        ],
        "disclaimer": (
            "Esta respuesta es educativa y orientativa. No constituye asesoría "
            "financiera, legal, tributaria ni promesa de rentabilidad."
        ),
    }


def build_financial_context(db: Session) -> dict:
    dashboard = build_dashboard(db)
    analytics = build_analytics_summary(db)
    forecast = build_forecast_summary(db)
    report = build_executive_report(db)

    return {
        "dashboard": dashboard,
        "analytics": analytics,
        "forecast": forecast,
        "report": report,
    }


def explain_score(score: float, risk_level: str) -> str:
    return (
        f"El score financiero actual es {score}, clasificado como {risk_level}. "
        "Este resultado se calcula a partir de liquidez, capacidad de ahorro, "
        "endeudamiento, estabilidad de gastos, cumplimiento de metas y educación financiera."
    )


def detect_risks(dashboard: dict, forecast: dict) -> list:
    risks = []

    savings_rate = dashboard.get("savings_rate", 0)
    debt_ratio = dashboard.get("debt_ratio", 0)
    goal_progress = dashboard.get("goal_progress_percentage", 0)
    liquidity_ratio = dashboard.get("liquidity_ratio", 0)

    if liquidity_ratio < 1:
        risks.append("Liquidez baja frente al nivel de gastos.")

    if savings_rate < 20:
        risks.append("Capacidad de ahorro inferior al nivel recomendado.")

    if debt_ratio > 30:
        risks.append("Nivel de deuda mensual elevado frente al ingreso.")

    if goal_progress < 30:
        risks.append("Avance bajo en metas financieras.")

    projected_score = (
        forecast.get("financial_health_forecast", {})
        .get("projected_score", {})
        .get("12_months", 0)
    )

    current_score = dashboard.get("financial_score", 0)

    if projected_score and projected_score < current_score:
        risks.append("El forecast muestra posible deterioro del score financiero.")

    if not risks:
        risks.append("Riesgo financiero controlado con los datos actuales.")

    return risks


def build_recommendations(dashboard: dict) -> list:
    recommendations = []

    savings_rate = dashboard.get("savings_rate", 0)
    debt_ratio = dashboard.get("debt_ratio", 0)
    goal_progress = dashboard.get("goal_progress_percentage", 0)

    if savings_rate < 20:
        recommendations.append("Reducir gastos variables y automatizar un ahorro mensual.")
    else:
        recommendations.append("Mantener la disciplina de ahorro actual.")

    if debt_ratio > 30:
        recommendations.append("Priorizar el pago de deudas de mayor costo financiero.")
    else:
        recommendations.append("Mantener el endeudamiento controlado y evitar nuevas obligaciones innecesarias.")

    if goal_progress < 30:
        recommendations.append("Aumentar aportes a metas financieras prioritarias.")
    else:
        recommendations.append("Continuar monitoreando el avance de metas mensualmente.")

    return recommendations


def build_action_plan(dashboard: dict) -> dict:
    savings_rate = dashboard.get("savings_rate", 0)
    debt_ratio = dashboard.get("debt_ratio", 0)
    goal_progress = dashboard.get("goal_progress_percentage", 0)

    plan_30_days = [
        "Actualizar ingresos, gastos, deudas y metas con datos reales.",
        "Revisar los tres principales gastos variables del mes.",
    ]

    if savings_rate < 20:
        plan_30_days.append("Definir un ahorro automático mínimo mensual.")
    else:
        plan_30_days.append("Mantener el nivel de ahorro y documentar el presupuesto.")

    plan_90_days = [
        "Crear seguimiento mensual del score financiero.",
        "Revisar progreso de metas y ajustar aportes.",
    ]

    if debt_ratio > 30:
        plan_90_days.append("Diseñar estrategia de reducción de deuda.")
    else:
        plan_90_days.append("Evitar adquirir nuevas deudas no estratégicas.")

    annual_plan = [
        "Consolidar fondo de emergencia.",
        "Construir planeación financiera anual.",
    ]

    if goal_progress < 30:
        annual_plan.append("Priorizar metas esenciales antes de metas secundarias.")
    else:
        annual_plan.append("Escalar metas hacia ahorro patrimonial de largo plazo.")

    return {
        "plan_30_days": plan_30_days,
        "plan_90_days": plan_90_days,
        "annual_plan": annual_plan,
    }


def generate_rule_based_advice(
    db: Session,
    household_id: int,
    question: str,
) -> dict:
    context = build_financial_context(db)

    dashboard = context["dashboard"]
    forecast = context["forecast"]
    report = context["report"]

    coach_response = generate_financial_coach_response(
        question=question,
        dashboard=dashboard,
    )

    score = dashboard.get("financial_score", 0)
    risk_level = dashboard.get("risk_level", "Sin clasificar")

    detected_risks = detect_risks(
        dashboard=dashboard,
        forecast=forecast,
    )

    recommendations = build_recommendations(
        dashboard=dashboard,
    )

    action_plan = build_action_plan(
        dashboard=dashboard,
    )

    executive_diagnosis = report.get(
        "executive_summary",
        {},
    ).get(
        "diagnosis",
        "La situación financiera requiere seguimiento con datos actualizados.",
    )

    return {
        "advisor": "TRIAH AI Financial Advisor",
        "mode": "rule_based_mvp",
        "household_id": household_id,
        "question": question,
        "executive_diagnosis": executive_diagnosis,
        "score_explanation": explain_score(
            score=score,
            risk_level=risk_level,
        ),
        "risk_level": risk_level,
        "financial_score": score,
        "family_diagnosis": coach_response["family_diagnosis"],
        "business_diagnosis": coach_response["business_diagnosis"],
        "detected_risks": detected_risks,
        "coach_detected_risks": coach_response["detected_risks"],
        "recommendations": recommendations,
        "responsible_recommendations": coach_response["responsible_recommendations"],
        "plan_30_days": action_plan["plan_30_days"],
        "coach_next_30_days": coach_response["next_30_days"],
        "plan_90_days": action_plan["plan_90_days"],
        "coach_next_90_days": coach_response["next_90_days"],
        "annual_plan": action_plan["annual_plan"],
        "financial_context": {
            "income": dashboard.get("income"),
            "expenses": dashboard.get("expenses"),
            "savings": dashboard.get("savings"),
            "savings_rate": dashboard.get("savings_rate"),
            "total_debt": dashboard.get("total_debt"),
            "debt_ratio": dashboard.get("debt_ratio"),
            "goal_progress": dashboard.get("goal_progress_percentage"),
            "liquidity_ratio": dashboard.get("liquidity_ratio"),
            "forecast_score_12_months": (
                forecast.get("financial_health_forecast", {})
                .get("projected_score", {})
                .get("12_months")
            ),
        },
        "responsible_disclaimer": (
            "Este diagnóstico es educativo y de apoyo para la toma de decisiones. "
            "No constituye asesoría legal, tributaria, financiera ni de inversión definitiva. "
            "TRIAH no promete rentabilidades y recomienda validar decisiones críticas con profesionales certificados."
        ),
    }


def generate_ai_financial_advice(
    db: Session,
    household_id: int,
    question: str,
) -> dict:
    if not OPENAI_ENABLED:
        return generate_rule_based_advice(
            db=db,
            household_id=household_id,
            question=question,
        )

    return generate_rule_based_advice(
        db=db,
        household_id=household_id,
        question=question,
    )