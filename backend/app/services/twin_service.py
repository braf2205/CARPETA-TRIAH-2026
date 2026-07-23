from typing import Dict, Any, List


def clamp(value: float, minimum: float = 0, maximum: float = 100) -> float:
    return max(minimum, min(value, maximum))


def classify_risk(score: float) -> str:
    if score >= 90:
        return "Escalable"
    if score >= 75:
        return "Saludable"
    if score >= 60:
        return "Estable"
    if score >= 40:
        return "Vulnerable"
    return "Crítico"


def calculate_score(
    savings_rate: float,
    liquidity_ratio: float,
    debt_ratio: float,
    goal_progress: float,
) -> float:
    liquidity_score = clamp(liquidity_ratio * 15)
    savings_score = clamp(savings_rate)
    debt_score = clamp(100 - debt_ratio)
    goals_score = clamp(goal_progress)

    score = (
        liquidity_score * 0.25
        + savings_score * 0.30
        + debt_score * 0.25
        + goals_score * 0.20
    )

    return round(clamp(score), 2)


def build_twin_case(
    name: str,
    income: float,
    expenses: float,
    total_debt: float,
    monthly_debt_payment: float,
    goal_progress: float,
    recommendation_context: str,
) -> Dict[str, Any]:
    savings = income - expenses
    savings_rate = round((savings / income) * 100, 2) if income > 0 else 0
    liquidity_ratio = round(savings / expenses, 2) if expenses > 0 else 0
    debt_ratio = round((monthly_debt_payment / income) * 100, 2) if income > 0 else 0

    financial_score = calculate_score(
        savings_rate=savings_rate,
        liquidity_ratio=liquidity_ratio,
        debt_ratio=debt_ratio,
        goal_progress=goal_progress,
    )

    risk_level = classify_risk(financial_score)

    estimated_net_position = round(savings - monthly_debt_payment, 2)

    return {
        "case": name,
        "income": round(income, 2),
        "expenses": round(expenses, 2),
        "savings": round(savings, 2),
        "savings_rate": savings_rate,
        "liquidity_ratio": liquidity_ratio,
        "total_debt": round(total_debt, 2),
        "monthly_debt_payment": round(monthly_debt_payment, 2),
        "debt_ratio": debt_ratio,
        "goal_progress": round(goal_progress, 2),
        "financial_score": financial_score,
        "risk_level": risk_level,
        "estimated_net_position": estimated_net_position,
        "recommendations": build_case_recommendations(
            risk_level=risk_level,
            savings_rate=savings_rate,
            liquidity_ratio=liquidity_ratio,
            debt_ratio=debt_ratio,
            goal_progress=goal_progress,
            context=recommendation_context,
        ),
    }


def build_case_recommendations(
    risk_level: str,
    savings_rate: float,
    liquidity_ratio: float,
    debt_ratio: float,
    goal_progress: float,
    context: str,
) -> List[str]:
    recommendations = [context]

    if savings_rate >= 40:
        recommendations.append(
            "Existe alta capacidad de ahorro para acelerar metas patrimoniales."
        )

    if liquidity_ratio >= 3:
        recommendations.append(
            "La liquidez permite absorber variaciones de gasto sin presión inmediata."
        )

    if debt_ratio <= 15:
        recommendations.append(
            "El endeudamiento mensual se mantiene en un rango controlado."
        )

    if goal_progress < 30:
        recommendations.append(
            "El avance de metas debe priorizarse frente al potencial de ahorro disponible."
        )

    if risk_level in ["Vulnerable", "Crítico"]:
        recommendations.append(
            "Se recomienda estabilizar liquidez, reducir gastos y controlar deuda antes de asumir nuevos compromisos."
        )

    return recommendations


def build_financial_twin(dashboard: Dict[str, Any]) -> Dict[str, Any]:
    income = float(dashboard.get("income", 0) or 0)
    expenses = float(dashboard.get("expenses", 0) or 0)
    total_debt = float(dashboard.get("total_debt", 0) or 0)
    monthly_debt_payment = float(dashboard.get("monthly_debt_payment", 0) or 0)
    goal_progress = float(dashboard.get("goal_progress_percentage", 0) or 0)

    current_position = build_twin_case(
        name="current_position",
        income=income,
        expenses=expenses,
        total_debt=total_debt,
        monthly_debt_payment=monthly_debt_payment,
        goal_progress=goal_progress,
        recommendation_context="Escenario base construido con la información financiera actual.",
    )

    expected_case = build_twin_case(
        name="expected_case",
        income=income * 1.05,
        expenses=expenses * 1.03,
        total_debt=total_debt,
        monthly_debt_payment=monthly_debt_payment,
        goal_progress=min(goal_progress + 5, 100),
        recommendation_context="Escenario esperado con crecimiento moderado de ingresos y gastos.",
    )

    best_case = build_twin_case(
        name="best_case",
        income=income * 1.15,
        expenses=expenses * 0.95,
        total_debt=total_debt * 0.90,
        monthly_debt_payment=monthly_debt_payment * 0.90,
        goal_progress=min(goal_progress + 15, 100),
        recommendation_context="Escenario optimista con mayor ingreso, menor gasto y reducción progresiva de deuda.",
    )

    worst_case = build_twin_case(
        name="worst_case",
        income=income * 0.85,
        expenses=expenses * 1.15,
        total_debt=total_debt,
        monthly_debt_payment=monthly_debt_payment,
        goal_progress=max(goal_progress - 5, 0),
        recommendation_context="Escenario adverso con reducción de ingresos y aumento de gastos.",
    )

    recommended_case = build_twin_case(
        name="recommended_case",
        income=income * 1.08,
        expenses=expenses * 0.97,
        total_debt=total_debt * 0.85,
        monthly_debt_payment=monthly_debt_payment * 0.85,
        goal_progress=min(goal_progress + 12, 100),
        recommendation_context="Escenario recomendado por TRIAH para mejorar score, liquidez y avance de metas.",
    )

    return {
        "status": "generated",
        "engine": "financial_twin_intelligence_v1",
        "financial_twin": {
            "current_position": current_position,
            "expected_case": expected_case,
            "best_case": best_case,
            "worst_case": worst_case,
            "recommended_case": recommended_case,
        },
        "disclaimer": (
            "Estos escenarios son simulaciones educativas. No constituyen asesoría financiera, legal, tributaria ni de inversión."
        ),
    }