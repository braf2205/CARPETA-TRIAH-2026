import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const question =
      body.question ||
      "¿Cómo puedo mejorar mi salud financiera?";

    const household_id =
      body.household_id || 1;

    const response = await fetch(`${BACKEND_URL}/ai/financial-advisor`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        household_id,
        question,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "AI Coach backend error",
          status: response.status,
          detail: await response.text(),
        },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      {
        error: "AI Coach dynamic error",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}