def classify_score(score: float) -> str:
    if score < 40:
        return "Crítico"
    if score < 60:
        return "Vulnerable"
    if score < 75:
        return "Estable"
    if score < 90:
        return "Saludable"
    return "Escalable"


def calculate_financial_score(
    monthly_income: float,
    monthly_expenses: float,
    savings: float,
    monthly_debt_payment: float,
    goals_progress: float,
    education_progress: float,
) -> dict:
    if monthly_income <= 0:
        return {
            "score": 0,
            "level": "Crítico",
            "components": {},
            "risks": ["No hay ingresos registrados"],
            "recommendations": [
                "Registra ingresos reales antes de calcular el diagnóstico."
            ],
        }

    liquidity = min(max((savings / monthly_income) * 100, 0), 100)

    savings_capacity = min(
        max(((monthly_income - monthly_expenses) / monthly_income) * 100, 0),
        100,
    )

    debt_health = min(
        max(100 - ((monthly_debt_payment / monthly_income) * 100), 0),
        100,
    )

    expense_stability = 70
    goals = min(max(goals_progress, 0), 100)
    education = min(max(education_progress, 0), 100)

    score = (
        liquidity * 0.25
        + savings_capacity * 0.20
        + debt_health * 0.20
        + expense_stability * 0.15
        + goals * 0.10
        + education * 0.10
    )

    risks = []
    recommendations = []

    if liquidity < 30:
        risks.append("Riesgo alto de liquidez")
        recommendations.append("Construir fondo de emergencia de 1 a 3 meses.")

    if savings_capacity < 15:
        risks.append("Baja capacidad de ahorro")
        recommendations.append("Reducir gastos variables y automatizar ahorro mensual.")

    if debt_health < 60:
        risks.append("Riesgo de sobreendeudamiento")
        recommendations.append("Priorizar el pago de deudas de mayor costo financiero.")

    if not risks:
        risks.append("Riesgo financiero controlado")
        recommendations.append(
            "Mantener disciplina financiera y avanzar en metas de ahorro."
        )

    return {
        "score": round(score, 2),
        "level": classify_score(score),
        "components": {
            "liquidity": round(liquidity, 2),
            "savings_capacity": round(savings_capacity, 2),
            "debt_health": round(debt_health, 2),
            "expense_stability": expense_stability,
            "goals_progress": goals,
            "education_progress": education,
        },
        "risks": risks,
        "recommendations": recommendations,
    }

