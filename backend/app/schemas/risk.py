from pydantic import BaseModel


class RiskInput(BaseModel):
    monthly_income: float
    monthly_expenses: float
    savings: float
    monthly_debt_payment: float
    goals_progress: float = 0
    education_progress: float = 0
    
    