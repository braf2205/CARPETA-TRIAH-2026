from datetime import datetime

from pydantic import BaseModel


class HouseholdCreate(BaseModel):
    name: str
    country: str | None = "Colombia"
    currency: str | None = "COP"
    members: int = 1
    monthly_income: float = 0
    monthly_expenses: float = 0


class HouseholdResponse(HouseholdCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
        