export async function GET() {
  try {
    const res = await fetch("http://127.0.0.1:8000/goals/", {
      cache: "no-store",
    });

    const text = await res.text();

    return new Response(text, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch("http://127.0.0.1:8000/goals/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    return new Response(text, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}