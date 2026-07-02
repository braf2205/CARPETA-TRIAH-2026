from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class TransactionCreate(BaseModel):
    household_id: int | None = None
    amount: float
    type: Literal["income", "expense"]
    category: str
    description: str | None = None


class TransactionResponse(TransactionCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True