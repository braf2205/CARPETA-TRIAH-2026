from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# =========================
# DATABASE
# =========================
from app.core.database import Base, engine

# =========================
# MODELS
# =========================
from app.models.user import User
from app.models.household import Household
from app.models.transaction import Transaction
from app.models.goal import Goal
from app.models.debt import Debt
from app.models.company import Company

# =========================
# API ROUTERS
# =========================
from app.api import (
    risk,
    risk_v2,
    analytics,
    forecast,
    twin,
    reports,
    pdf,
    ai,
    auth,
    dashboard,
    debts,
    transactions,
    goals,
    companies,
    households,
)

# =========================
# CREATE TABLES
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# APP
# =========================
app = FastAPI(
    title="TRIAH API",
    description="Fintech de inteligencia financiera familiar y empresarial impulsada por IA",
    version="0.3.0",
)

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://solid-space-happiness-vpvxrrv6qx7gcprrw-3000.app.github.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTERS
# =========================
app.include_router(ai.router)
app.include_router(risk.router)
app.include_router(risk_v2.router)
app.include_router(analytics.router)
app.include_router(forecast.router)
app.include_router(twin.router)
app.include_router(reports.router)
app.include_router(pdf.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(debts.router)
app.include_router(transactions.router)
app.include_router(goals.router)
app.include_router(companies.router)
app.include_router(households.router)


# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {
        "message": "TRIAH API funcionando correctamente",
        "version": "0.3.0",
        "modules": [
            "dashboard",
            "debts",
            "transactions",
            "goals",
            "companies",
            "households",
            "risk",
            "ai",
            "auth",
        ],
    }

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health():
    return {
        "status": "ok",
        "api": "TRIAH",
        "version": "0.3.0",
    }