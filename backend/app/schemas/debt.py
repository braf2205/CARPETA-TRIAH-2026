from pydantic import BaseModel


class DebtCreate(BaseModel):
    name: str
    amount: float
    monthly_payment: float
    interest_rate: float


class DebtResponse(DebtCreate):
    id: int

    class Config:
        from_attributes = True
        