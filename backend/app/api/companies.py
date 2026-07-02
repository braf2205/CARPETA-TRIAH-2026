from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyResponse

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.post("/", response_model=CompanyResponse)
def create_company(payload: CompanyCreate, db: Session = Depends(get_db)):
    company = Company(
        legal_name=payload.legal_name,
        name=payload.name or payload.legal_name,
        industry=payload.industry,
        annual_revenue=payload.annual_revenue,
        monthly_expenses=payload.monthly_expenses,
        employees=payload.employees,
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company


@router.get("/", response_model=list[CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()


@router.delete("/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()

    if company:
        db.delete(company)
        db.commit()

    return {"message": "Company deleted"}