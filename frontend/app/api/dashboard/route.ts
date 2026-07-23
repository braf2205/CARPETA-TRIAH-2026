import { NextResponse } from "next/server";

/* ============================================================
   TRIAH FINTECH
   Dashboard API Proxy
   ------------------------------------------------------------
   Este endpoint NO realiza cálculos financieros.
   Toda la lógica financiera vive en:
   backend/app/services/dashboard_service.py
   ============================================================ */

const BACKEND_URL =
  process.env.BACKEND_URL?.trim() ||
  "http://127.0.0.1:8000";

/* ============================================================
   TYPES
   ============================================================ */

type DashboardResponse = Record<string, unknown>;

/* ============================================================
   HELPERS
   ============================================================ */

function normalizeBackendUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function buildErrorResponse(
  error: string,
  detail: string,
  status: number,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json(
    {
      error,
      detail,
      backend_url: normalizeBackendUrl(BACKEND_URL),
      timestamp: new Date().toISOString(),
      ...extra,
    },
    { status }
  );
}

/* ============================================================
   GET /api/dashboard
   ============================================================ */

export async function GET() {
  const backendUrl = normalizeBackendUrl(BACKEND_URL);
  const endpoint = `${backendUrl}/dashboard/`;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    console.log("TRIAH Dashboard Proxy endpoint:", endpoint);

    const response = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    const backendText = await response.text();

    clearTimeout(timeout);

    if (!response.ok) {
      return buildErrorResponse(
        "Dashboard backend error",
        backendText || "FastAPI no respondió correctamente.",
        500,
        {
          backend_status: response.status,
          endpoint,
        }
      );
    }

    const dashboard: DashboardResponse = JSON.parse(backendText);

    return NextResponse.json(dashboard, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    clearTimeout(timeout);

    console.error("TRIAH Dashboard Proxy Error:", error);

    return buildErrorResponse(
      "Dashboard dynamic error",
      error instanceof Error ? error.message : String(error),
      500,
      {
        endpoint,
      }
    );
  }
}

/* ============================================================
   OPTIONS
   ============================================================ */

export async function OPTIONS() {
  return NextResponse.json(
    {
      status: "ok",
      module: "dashboard_proxy",
      allowed_methods: ["GET", "OPTIONS"],
    },
    { status: 200 }
  );
}