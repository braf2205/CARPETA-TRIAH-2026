from typing import Dict, Any, List


def pct(value: float) -> str:
    return f"{round(value or 0, 2)}%"


def money(value: float) -> str:
    return f"${round(value or 0):,}".replace(",", ".")


def build_executive_intelligence(dashboard: Dict[str, Any]) -> Dict[str, Any]:
    income = dashboard.get("income", 0)
    expenses = dashboard.get("expenses", 0)
    savings = dashboard.get("savings", 0)
    savings_rate = dashboard.get("savings_rate", 0)
    debt_ratio = dashboard.get("debt_ratio", 0)
    liquidity_ratio = dashboard.get("liquidity_ratio", 0)
    score = dashboard.get("financial_score", 0)
    risk_level = dashboard.get("risk_level", "No calculado")
    goal_progress = dashboard.get("goal_progress_percentage", 0)
    monthly_debt_payment = dashboard.get("monthly_debt_payment", 0)

    strengths: List[str] = []
    weaknesses: List[str] = []
    alerts: List[Dict[str, str]] = []
    opportunities: List[str] = []
    priority_actions: List[str] = []

    if savings_rate >= 25:
        strengths.append("Alta capacidad de ahorro frente al ingreso mensual.")
    else:
        weaknesses.append("La capacidad de ahorro requiere fortalecimiento.")

    if liquidity_ratio >= 3:
        strengths.append("Liquidez sólida para cubrir gastos mensuales.")
    else:
        alerts.append({
            "level": "medium",
            "title": "Liquidez por mejorar",
            "impact": "Puede limitar la capacidad de respuesta ante imprevistos.",
            "action": "Construir o reforzar fondo de emergencia."
        })

    if debt_ratio <= 30:
        strengths.append("Nivel de deuda mensual controlado.")
    else:
        weaknesses.append("La deuda mensual puede presionar el flujo de caja.")

    if goal_progress < 30:
        weaknesses.append("El avance de metas financieras es bajo frente al potencial de ahorro.")
        priority_actions.append("Acelerar el fondeo de metas prioritarias.")

    if score >= 75:
        strengths.append("Score financiero saludable según Risk Engine V2.")
    elif score < 60:
        alerts.append({
            "level": "high",
            "title": "Score financiero vulnerable",
            "impact": "La salud financiera requiere acciones correctivas.",
            "action": "Reducir gastos, fortalecer liquidez y priorizar deuda."
        })

    if savings > monthly_debt_payment and monthly_debt_payment > 0:
        opportunities.append(
            "Existe capacidad para reducir deuda sin comprometer la liquidez mensual."
        )

    if savings_rate >= 40:
        opportunities.append(
            "El nivel de ahorro permite acelerar metas patrimoniales o crear un plan de inversión responsable."
        )

    if not alerts:
        alerts.append({
            "level": "low",
            "title": "Sin alertas críticas",
            "impact": "La posición financiera actual se mantiene controlada.",
            "action": "Mantener seguimiento mensual y disciplina financiera."
        })

    if not priority_actions:
        priority_actions = [
            "Mantener disciplina de ahorro mensual.",
            "Acelerar metas financieras con bajo avance.",
            "Revisar oportunidades de optimización de deuda.",
        ]

    financial_story = (
        f"TRIAH identifica una posición financiera {risk_level}. "
        f"El hogar registra ingresos por {money(income)}, gastos por {money(expenses)} "
        f"y ahorro mensual estimado de {money(savings)}. "
        f"La tasa de ahorro es {pct(savings_rate)}, la liquidez es {round(liquidity_ratio or 0, 2)}x "
        f"y el avance de metas alcanza {pct(goal_progress)}."
    )

    return {
        "status": "generated",
        "financial_story": financial_story,
        "executive_summary": {
            "score": score,
            "risk_level": risk_level,
            "diagnosis": f"Estado financiero {risk_level} con score {score}/100.",
        },
        "strengths": strengths,
        "weaknesses": weaknesses,
        "alerts": alerts,
        "opportunities": opportunities,
        "priority_actions": priority_actions,
        "next_30_days": [
            "Actualizar todos los gastos e ingresos del mes.",
            "Revisar metas con avance inferior al 30%.",
            "Asignar una parte del ahorro mensual a objetivos prioritarios.",
        ],
        "disclaimer": (
            "Este análisis es educativo y no constituye asesoría financiera, legal, tributaria ni de inversión."
        ),
    }