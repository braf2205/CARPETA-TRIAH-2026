"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  premium:
    "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800",
  card:
    "rounded-3xl bg-slate-900 border border-slate-800 p-6 hover:border-emerald-500/40 transition",
  ai:
    "rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 p-6",
};

type Dashboard = {
  income: number;
  expenses: number;
  savings: number;
  savings_rate: number;
  financial_score: number;
  risk_level: string;
  goal_progress_percentage: number;
  total_debt?: number;
  monthly_debt_payment?: number;
  debt_ratio?: number;
  liquidity_ratio?: number;
  risk_components?: Record<string, number>;
  risks?: string[];
  recommendations?: string[];
  total_companies?: number;
  total_households?: number;
};

type Coach = {
  family_diagnosis?: {
    summary?: string;
  };
  detected_risks?: string[];
  next_30_days?: string[];
  next_90_days?: string[];
  responsible_recommendations?: string[];
  disclaimer?: string;
};

export default function Home() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [coachLoading, setCoachLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard");

        if (!res.ok) {
          setError("No se pudo cargar el Dashboard de TRIAH.");
          console.error("Dashboard error:", res.status);
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        setError("Error cargando dashboard. Verifica FastAPI en puerto 8000.");
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function askCoach() {
    try {
      setCoachLoading(true);
      const res = await fetch("/api/coach", {
        method: "POST",
      });

      if (!res.ok) {
        setError("No se pudo generar el diagnóstico del coach financiero.");
        return;
      }

      const json = await res.json();
      setCoach(json);
    } catch (error) {
      setError("Error consultando AI Financial Coach.");
      console.error("Error coach:", error);
    } finally {
      setCoachLoading(false);
    }
  }

  const chartData = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: "Ingresos",
        value: data.income,
      },
      {
        name: "Gastos",
        value: data.expenses,
      },
      {
        name: "Ahorro",
        value: data.savings,
      },
    ];
  }, [data]);

  if (loading) {
    return <LoadingState />;
  }

  if (error && !data) {
    return <ErrorState message={error} />;
  }

  if (!data) {
    return <EmptyState />;
  }

  const riskBadge = getRiskBadge(data.risk_level);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
      <section className="max-w-7xl mx-auto">
        <NavigationBar />

        <header className={`${COLORS.premium} rounded-3xl p-8`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm text-emerald-400 font-semibold tracking-widest">
                TRIAH FINTECH SAAS
              </p>

              <h1 className="text-4xl lg:text-5xl font-bold mt-3">
                TRIAH CFO Digital Dashboard
              </h1>

              <p className="text-slate-400 mt-3 max-w-2xl">
                Inteligencia financiera familiar y empresarial con Risk Engine,
                Forecast, Financial Twin, reportes ejecutivos e IA.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full border text-sm ${riskBadge}`}>
                  {data.risk_level}
                </span>

                <span className="px-3 py-1 rounded-full border border-slate-700 text-sm text-slate-300">
                  Score {data.financial_score}/100
                </span>

                <span className="px-3 py-1 rounded-full border border-slate-700 text-sm text-slate-300">
                  Liquidez {data.liquidity_ratio ?? 0}x
                </span>
              </div>
            </div>

            <a
              href="/api/pdf/executive"
              target="_blank"
              className="rounded-2xl bg-emerald-500 text-slate-950 px-6 py-4 font-bold hover:bg-emerald-400 text-center"
            >
              Descargar Reporte PDF
            </a>
          </div>
        </header>

        {error && (
          <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200 text-sm">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          <Card title="Ingresos" value={data.income} />
          <Card title="Gastos" value={data.expenses} />
          <Card title="Ahorro" value={data.savings} />
          <Card title="Tasa de ahorro" value={`${data.savings_rate}%`} />
          <Card title="Score financiero" value={`${data.financial_score}/100`} />
          <Card title="Riesgo" value={data.risk_level} />
          <Card title="Avance metas" value={`${data.goal_progress_percentage}%`} />
          <Card title="Deuda total" value={data.total_debt ?? 0} />
          <Card title="Pago mensual deuda" value={data.monthly_debt_payment ?? 0} />
          <Card title="Ratio deuda" value={`${data.debt_ratio ?? 0}%`} />
          <Card title="Liquidez" value={`${data.liquidity_ratio ?? 0}x`} />
          <Card title="Empresas" value={data.total_companies ?? 0} />
          <Card title="Hogares" value={data.total_households ?? 0} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <RiskScorePanel data={data} />

          <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-2xl font-bold mb-6">Ingresos vs Gastos</h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <InsightPanel
            title="Riesgos detectados"
            items={data.risks || ["Sin riesgos críticos registrados."]}
            color="red"
          />

          <InsightPanel
            title="Recomendaciones"
            items={data.recommendations || ["Mantener disciplina financiera."]}
            color="emerald"
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <RiskComponents components={data.risk_components || {}} />
          <ExecutiveSummary data={data} />
        </section>

        <section className={`${COLORS.ai} mt-10`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">AI Financial Coach</h2>

              <p className="text-slate-400 mt-2">
                Diagnóstico financiero automático con IA basada en tus datos.
              </p>
            </div>

            <button
              onClick={askCoach}
              disabled={coachLoading}
              className="rounded-xl bg-white text-slate-950 px-5 py-3 font-bold disabled:opacity-60 hover:bg-slate-200"
            >
              {coachLoading ? "Analizando..." : "Analizar mi salud financiera"}
            </button>
          </div>

          {coach && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CoachBox
                title="Diagnóstico Ejecutivo"
                items={[coach.family_diagnosis?.summary || "Diagnóstico no disponible."]}
              />

              <CoachBox
                title="Riesgos Detectados"
                items={coach.detected_risks || []}
              />

              <CoachBox
                title="Plan 30 días"
                items={coach.next_30_days || []}
              />

              <CoachBox
                title="Plan 90 días"
                items={coach.next_90_days || []}
              />

              <CoachBox
                title="Recomendaciones responsables"
                items={coach.responsible_recommendations || []}
              />

              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
                <p className="text-indigo-300 text-sm font-semibold mb-3">
                  Disclaimer
                </p>

                <p className="text-sm text-slate-300">
                  {coach.disclaimer ||
                    "Esta respuesta es educativa y no constituye asesoría financiera, legal, tributaria ni promesa de rentabilidad."}
                </p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function NavigationBar() {
  const links = [
    { href: "/", label: "Dashboard", active: true },
    { href: "/debts", label: "Deudas" },
    { href: "/debts/new", label: "Nueva Deuda" },
    { href: "/companies", label: "Empresas" },
    { href: "/transactions", label: "Transacciones" },
    { href: "/goals", label: "Metas" },
    { href: "/goals/new", label: "Nueva Meta" },
    { href: "/analytics", label: "Analytics" },
  ];

  return (
    <nav className="flex flex-wrap gap-3 mb-10">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={
            link.active
              ? "rounded-xl bg-white text-slate-950 px-5 py-3 font-bold"
              : "rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-slate-300 hover:text-white hover:border-slate-600 transition"
          }
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className={COLORS.card}>
      <p className="text-slate-400 text-sm">{title}</p>

      <h2 className="text-2xl lg:text-3xl font-bold mt-3">
        {typeof value === "number" ? formatNumber(value) : value}
      </h2>
    </div>
  );
}

function RiskScorePanel({ data }: { data: Dashboard }) {
  const score = data.financial_score || 0;
  const width = Math.min(Math.max(score, 0), 100);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
      <p className="text-slate-400 text-sm">Financial Health Score</p>

      <h2 className="text-5xl font-bold mt-3">{score}</h2>

      <p className={`inline-block mt-3 px-3 py-1 rounded-full border text-sm ${getRiskBadge(data.risk_level)}`}>
        {data.risk_level}
      </p>

      <div className="mt-6 h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${width}%` }}
        />
      </div>

      <p className="text-slate-500 text-sm mt-4">
        Score calculado con liquidez, capacidad de ahorro, endeudamiento, metas
        y educación financiera.
      </p>
    </div>
  );
}

function InsightPanel({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "red" | "emerald";
}) {
  const colorClass =
    color === "red" ? "text-red-300 border-red-500/30" : "text-emerald-300 border-emerald-500/30";

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
      <h2 className={`text-xl font-bold mb-4 ${colorClass}`}>{title}</h2>

      <ul className="space-y-3 text-sm text-slate-300">
        {(items || []).map((item, index) => (
          <li
            key={index}
            className="rounded-xl bg-slate-950 border border-slate-800 p-4"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskComponents({
  components,
}: {
  components: Record<string, number>;
}) {
  const entries = Object.entries(components || {});

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
      <h2 className="text-xl font-bold mb-4">Componentes del Risk Engine</h2>

      {entries.length === 0 ? (
        <p className="text-slate-400">Sin componentes disponibles.</p>
      ) : (
        <div className="space-y-4">
          {entries.map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">{formatLabel(key)}</span>
                <span>{value}</span>
              </div>

              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExecutiveSummary({ data }: { data: Dashboard }) {
  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
      <h2 className="text-xl font-bold mb-4">Resumen ejecutivo</h2>

      <div className="space-y-3 text-sm text-slate-300">
        <p>
          TRIAH identifica un nivel de riesgo{" "}
          <span className="font-bold text-white">{data.risk_level}</span> con un
          score financiero de{" "}
          <span className="font-bold text-white">{data.financial_score}/100</span>.
        </p>

        <p>
          El hogar registra una tasa de ahorro de{" "}
          <span className="font-bold text-white">{data.savings_rate}%</span> y
          una liquidez de{" "}
          <span className="font-bold text-white">{data.liquidity_ratio ?? 0}x</span>.
        </p>

        <p>
          El avance de metas está en{" "}
          <span className="font-bold text-white">
            {data.goal_progress_percentage}%
          </span>
          , por lo que se recomienda seguimiento mensual.
        </p>
      </div>
    </div>
  );
}

function CoachBox({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
      <p className="text-emerald-400 text-sm font-semibold mb-3">{title}</p>

      <ul className="space-y-2 text-sm text-slate-200">
        {(items || []).map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 flex items-center justify-center">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center">
        <h1 className="text-3xl font-bold">Cargando TRIAH...</h1>

        <p className="text-slate-400 mt-4">
          Preparando el CFO Digital Dashboard.
        </p>
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 flex items-center justify-center">
      <div className="rounded-3xl bg-red-950/40 border border-red-800 p-8 max-w-xl">
        <h1 className="text-3xl font-bold text-red-300">Error cargando TRIAH</h1>

        <p className="text-red-100 mt-4">{message}</p>

        <a
          href="/api/dashboard"
          className="inline-block mt-6 rounded-xl bg-white text-slate-950 px-5 py-3 font-bold"
        >
          Probar API Dashboard
        </a>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 flex items-center justify-center">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center">
        <h1 className="text-3xl font-bold">Sin datos financieros</h1>

        <p className="text-slate-400 mt-4">
          Registra ingresos, gastos, deudas y metas para activar TRIAH.
        </p>
      </div>
    </main>
  );
}

function getRiskBadge(level: string) {
  if (level === "Escalable") {
    return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
  }

  if (level === "Saludable") {
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  }

  if (level === "Estable") {
    return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  }

  if (level === "Vulnerable") {
    return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  }

  return "bg-red-500/20 text-red-300 border-red-500/30";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-CO").format(value);
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}