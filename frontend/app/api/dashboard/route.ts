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
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://solid-space-happiness-vpvxrrv6qx7gcprrw-8000.app.github.dev";

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

  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);

    const response = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const backendMessage = await response.text();

      return buildErrorResponse(
        "Dashboard backend error",
        backendMessage || "FastAPI no respondió correctamente.",
        response.status,
        {
          backend_status: response.status,
          endpoint,
        }
      );
    }

    const dashboard: DashboardResponse = await response.json();

    return NextResponse.json(dashboard, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
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