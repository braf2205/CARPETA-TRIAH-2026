from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from app.core.database import Base


class Household(Base):
    __tablename__ = "households"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=True, default="Colombia")
    currency = Column(String, nullable=True, default="COP")
    members = Column(Integer, default=1)
    monthly_income = Column(Float, default=0)
    monthly_expenses = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    