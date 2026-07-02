def safe_divide(numerator: float, denominator: float) -> float:
    if denominator == 0:
        return 0
    return round(numerator / denominator, 4)


def calculate_savings_rate(income: float, expenses: float) -> float:
    if income <= 0:
        return 0
    return round(((income - expenses) / income) * 100, 2)


def calculate_debt_ratio(monthly_debt_payment: float, income: float) -> float:
    if income <= 0:
        return 0
    return round((monthly_debt_payment / income) * 100, 2)


def calculate_goal_progress(current_goals: float, total_goals: float) -> float:
    if total_goals <= 0:
        return 0
    return round((current_goals / total_goals) * 100, 2)


def calculate_liquidity_ratio(savings: float, expenses: float) -> float:
    if expenses <= 0:
        return 0
    return round(savings / expenses, 2)


def calculate_financial_score(
    savings_rate: float,
    debt_ratio: float,
    liquidity_ratio: float,
    goal_progress: float
) -> int:
    score = 0

    score += min(max(savings_rate, 0), 40)

    if debt_ratio <= 20:
        score += 25
    elif debt_ratio <= 35:
        score += 15
    elif debt_ratio <= 50:
        score += 8
    else:
        score += 0

    if liquidity_ratio >= 3:
        score += 20
    elif liquidity_ratio >= 1:
        score += 12
    else:
        score += 5

    score += min(goal_progress * 0.15, 15)

    return int(min(score, 100))


def classify_risk_level(score: int) -> str:
    if score < 40:
        return "Crítico"
    if score < 60:
        return "Vulnerable"
    if score < 75:
        return "Estable"
    if score < 90:
        return "Saludable"
    return "Escalable"