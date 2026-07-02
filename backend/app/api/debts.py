from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.debt import Debt
from app.schemas.debt import DebtCreate, DebtResponse

router = APIRouter(prefix="/debts", tags=["Debts"])


@router.post("/", response_model=DebtResponse)
def create_debt(payload: DebtCreate, db: Session = Depends(get_db)):
    debt = Debt(**payload.dict())
    db.add(debt)
    db.commit()
    db.refresh(debt)
    return debt


@router.get("/", response_model=list[DebtResponse])
def get_debts(db: Session = Depends(get_db)):
    return db.query(Debt).all()


@router.delete("/{debt_id}")
def delete_debt(debt_id: int, db: Session = Depends(get_db)):
    debt = db.query(Debt).filter(Debt.id == debt_id).first()

    if debt:
        db.delete(debt)
        db.commit()

    return {"message": "Debt deleted"}