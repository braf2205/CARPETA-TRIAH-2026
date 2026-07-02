from datetime import datetime

from pydantic import BaseModel


class GoalCreate(BaseModel):
    household_id: int | None = None
    title: str
    target_amount: float
    current_amount: float = 0
    target_date: datetime | None = None


class GoalResponse(GoalCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
        