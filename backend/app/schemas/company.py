from datetime import datetime

from pydantic import BaseModel


class CompanyCreate(BaseModel):
    legal_name: str
    name: str | None = None
    industry: str | None = None
    annual_revenue: float = 0
    monthly_expenses: float = 0
    employees: int = 0


class CompanyResponse(CompanyCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True