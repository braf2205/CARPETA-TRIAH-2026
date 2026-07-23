import { NextResponse } from "next/server";

/* ============================================================
   TRIAH FINTECH
   Financial Twin API Proxy
   ------------------------------------------------------------
   Este endpoint NO calcula escenarios.
   Consume FastAPI:
   backend/app/api/twin.py
   ============================================================ */

const BACKEND_URL =
  process.env.BACKEND_URL?.trim() ||
  "http://127.0.0.1:8000";

/* ============================================================
   HELPERS
   ============================================================ */

function normalizeBackendUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/* ============================================================
   GET /api/twin
   ============================================================ */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const income_change_pct =
    searchParams.get("income_change_pct") || "0";

  const expense_change_pct =
    searchParams.get("expense_change_pct") || "0";

  const extra_savings_pct =
    searchParams.get("extra_savings_pct") || "0";

  const payoff_debt =
    searchParams.get("payoff_debt") || "false";

  const backendUrl = normalizeBackendUrl(BACKEND_URL);

  const endpoint =
    `${backendUrl}/twin/scenario` +
    `?income_change_pct=${income_change_pct}` +
    `&expense_change_pct=${expense_change_pct}` +
    `&extra_savings_pct=${extra_savings_pct}` +
    `&payoff_debt=${payoff_debt}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Financial Twin backend error",
          detail: text,
          backend_status: response.status,
          endpoint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(JSON.parse(text), {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Financial Twin proxy error",
        detail: error instanceof Error ? error.message : String(error),
        endpoint,
      },
      { status: 500 }
    );
  }
}