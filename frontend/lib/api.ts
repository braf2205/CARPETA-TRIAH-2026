const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://solid-space-happiness-vpvxrrv6qx7gcprrw-8000.app.github.dev";

async function fetchApi(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status} en ${endpoint}`);
  }

  return response.json();
}

export async function getDashboard() {
  return fetchApi("/dashboard/");
}

export async function getAnalytics() {
  return fetchApi("/analytics/summary");
}

export async function getForecast() {
  return fetchApi("/forecast/summary");
}

export async function getExecutiveReport() {
  return fetchApi("/reports/executive-json");
}

export async function getTwinScenario() {
  return fetchApi("/twin/scenario");
}

export async function getAiFinancialAdvisor(question: string) {
  const response = await fetch(`${API_URL}/ai/financial-advisor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      household_id: 1,
      question,
    }),
  });

  if (!response.ok) {
    throw new Error("Error consultando AI Financial Advisor");
  }

  return response.json();
}

export function getPdfUrl() {
  return `${API_URL}/pdf/executive`;
}