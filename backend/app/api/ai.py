from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.ai_agent import generate_ai_financial_advice


router = APIRouter(
    prefix="/ai",
    tags=["AI Agent"]
)


class AgentRequest(BaseModel):
    question: str


class FinancialAdvisorRequest(BaseModel):
    household_id: int = 1
    question: str


@router.post("/agent")
def financial_agent(
    payload: AgentRequest,
    db: Session = Depends(get_db),
):
    return {
        "advisor": "TRIAH AI Agent",
        "mode": "basic",
        "question": payload.question,
        "answer": (
            "TRIAH está listo para analizar información financiera. "
            "Usa /ai/financial-advisor para recibir diagnóstico completo."
        ),
    }


@router.post("/financial-advisor")
def financial_advisor(
    payload: FinancialAdvisorRequest,
    db: Session = Depends(get_db),
):
    return generate_ai_financial_advice(
        db=db,
        household_id=payload.household_id,
        question=payload.question,
    )


@router.get("/health")
def ai_health():
    return {
        "status": "ok",
        "module": "ai_financial_advisor",
        "message": "AI Financial Advisor funcionando correctamente",
    }