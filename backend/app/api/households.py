from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.household import Household
from app.schemas.household import HouseholdCreate, HouseholdResponse

router = APIRouter(prefix="/households", tags=["Households"])


@router.post("/", response_model=HouseholdResponse)
def create_household(payload: HouseholdCreate, db: Session = Depends(get_db)):
    household = Household(**payload.dict())

    db.add(household)
    db.commit()
    db.refresh(household)

    return household


@router.get("/", response_model=list[HouseholdResponse])
def get_households(db: Session = Depends(get_db)):
    return db.query(Household).all()


@router.delete("/{household_id}")
def delete_household(household_id: int, db: Session = Depends(get_db)):
    household = db.query(Household).filter(Household.id == household_id).first()

    if household:
        db.delete(household)
        db.commit()

    return {"message": "Household deleted"}
