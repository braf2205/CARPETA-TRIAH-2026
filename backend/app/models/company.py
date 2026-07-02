from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from app.core.database import Base


class Company(Base):
    __tablename__ = "companies"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    legal_name = Column(String, nullable=False)
    name = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    annual_revenue = Column(Float, default=0)
    monthly_expenses = Column(Float, default=0)
    employees = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    