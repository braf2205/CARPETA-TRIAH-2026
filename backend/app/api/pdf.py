from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.pdf_service import generate_executive_pdf


router = APIRouter(
    prefix="/pdf",
    tags=["PDF Reports"]
)


@router.get("/executive")
def executive_pdf(
    db: Session = Depends(get_db)
):
    pdf_buffer = generate_executive_pdf(db)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=TRIAH_Executive_Report.pdf"
        },
    )


@router.get("/health")
def pdf_health():
    return {
        "status": "ok",
        "module": "pdf_reports",
        "message": "PDF Executive Report Engine funcionando correctamente",
    }