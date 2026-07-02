from datetime import datetime
from io import BytesIO

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from sqlalchemy.orm import Session

from app.services.report_service import build_executive_report


def write_line(pdf, text, x, y, size=10):
    pdf.setFont("Helvetica", size)
    pdf.drawString(x, y, str(text))
    return y - 16


def generate_executive_pdf(db: Session):
    report = build_executive_report(db)

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    width, height = letter
    x = 0.7 * inch
    y = height - 0.8 * inch

    executive = report.get("executive_summary", {})
    risk = report.get("risk_analysis", {})
    forecast = report.get("forecast", {})
    twin = report.get("financial_twin", {})
    action_plan = report.get("action_plan", {})

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(x, y, "TRIAH Executive Financial Report")
    y -= 30

    pdf.setFont("Helvetica", 10)
    pdf.drawString(x, y, f"Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    y -= 30

    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(x, y, "Executive Summary")
    y -= 20

    y = write_line(pdf, f"Financial Score: {executive.get('financial_score')}", x, y)
    y = write_line(pdf, f"Risk Level: {executive.get('risk_level')}", x, y)
    y = write_line(pdf, f"Income: {executive.get('income')}", x, y)
    y = write_line(pdf, f"Expenses: {executive.get('expenses')}", x, y)
    y = write_line(pdf, f"Savings: {executive.get('savings')}", x, y)
    y = write_line(pdf, f"Savings Rate: {executive.get('savings_rate')}%", x, y)
    y = write_line(pdf, f"Debt Ratio: {executive.get('debt_ratio')}%", x, y)
    y = write_line(pdf, f"Goal Progress: {executive.get('goal_progress')}%", x, y)

    y -= 10
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(x, y, "Detected Risks")
    y -= 20

    for item in risk.get("risks", []):
        y = write_line(pdf, f"- {item}", x, y)

    y -= 10
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(x, y, "Recommendations")
    y -= 20

    for item in risk.get("recommendations", []):
        y = write_line(pdf, f"- {item}", x, y)

    if y < 180:
        pdf.showPage()
        y = height - 0.8 * inch

    y -= 10
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(x, y, "Forecast")
    y -= 20

    health_forecast = forecast.get("financial_health_forecast", {})
    projected_score = health_forecast.get("projected_score", {})

    for key, value in projected_score.items():
        y = write_line(pdf, f"{key}: {value}", x, y)

    y -= 10
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(x, y, "Financial Twin")
    y -= 20

    base = twin.get("base_scenario", {}).get("simulated_state", {})
    stress = twin.get("stress_scenario", {}).get("simulated_state", {})
    improvement = twin.get("improvement_scenario", {}).get("simulated_state", {})

    y = write_line(pdf, f"Base Score: {base.get('financial_score')}", x, y)
    y = write_line(pdf, f"Stress Score: {stress.get('financial_score')}", x, y)
    y = write_line(pdf, f"Improvement Score: {improvement.get('financial_score')}", x, y)

    if y < 220:
        pdf.showPage()
        y = height - 0.8 * inch

    y -= 10
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(x, y, "Action Plan")
    y -= 20

    y = write_line(pdf, "30 Days:", x, y)
    for item in action_plan.get("plan_30_days", []):
        y = write_line(pdf, f"- {item}", x + 15, y)

    y = write_line(pdf, "90 Days:", x, y)
    for item in action_plan.get("plan_90_days", []):
        y = write_line(pdf, f"- {item}", x + 15, y)

    y = write_line(pdf, "Annual Plan:", x, y)
    for item in action_plan.get("annual_plan", []):
        y = write_line(pdf, f"- {item}", x + 15, y)

    if y < 120:
        pdf.showPage()
        y = height - 0.8 * inch

    y -= 15
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(x, y, "Disclaimer")
    y -= 18

    disclaimer = report.get(
        "disclaimer",
        "This report is educational and does not constitute financial, legal, tax or investment advice.",
    )

    pdf.setFont("Helvetica", 8)
    pdf.drawString(x, y, disclaimer[:110])

    pdf.save()
    buffer.seek(0)

    return buffer