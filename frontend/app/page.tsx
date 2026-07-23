"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = {
  page: "min-h-screen bg-[#020617] text-white p-6 lg:p-10",
  shell: "max-w-7xl mx-auto space-y-10",
  card: "rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl shadow-black/20",
  cardHover:
    "rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl shadow-black/20 hover:border-emerald-500/40 transition",
  hero:
    "rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 border border-slate-800 p-8 lg:p-10 shadow-2xl shadow-black/30",
  ai:
    "rounded-[2rem] bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-700/40 p-6 lg:p-8 shadow-2xl shadow-indigo-950/20",
};

type Dashboard = {
  executive_summary?: {
    monthly_income?: number;
    monthly_expenses?: number;
    monthly_savings?: number;
    savings_rate?: number;
    debt_ratio?: number;
    goal_progress?: number;
    financial_health_score?: number;
    risk_level?: string;
  };

  executive_intelligence?: {
    financial_story?: string;
    executive_summary?: {
      score?: number;
      risk_level?: string;
      diagnosis?: string;
    };
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    priority_actions?: string[];
    next_30_days?: string[];
    alerts?: {
      level: string;
      title: string;
      impact: string;
      action: string;
    }[];
    disclaimer?: string;
  };
financial_twin_intelligence?: FinancialTwinIntelligence;

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
  total_goals?: number;
  current_goals?: number;
  total_company_revenue?: number;
  total_company_monthly_expenses?: number;
  company_margin?: number;
};

type FinancialTwinCase = {
  case: string;

  income: number;

  expenses: number;

  savings: number;

  savings_rate: number;

  liquidity_ratio: number;

  total_debt: number;

  monthly_debt_payment: number;

  debt_ratio: number;

  goal_progress: number;

  financial_score: number;

  risk_level: string;

  estimated_net_position: number;

  recommendations: string[];
};

type FinancialTwinIntelligence = {
  status: string;

  engine: string;

  financial_twin: {

    current_position: FinancialTwinCase;

    expected_case: FinancialTwinCase;

    best_case: FinancialTwinCase;

    worst_case: FinancialTwinCase;

    recommended_case: FinancialTwinCase;

  };

  disclaimer: string;
};

type Coach = {
  advisor?: string;
  mode?: string;
  household_id?: number;
  question?: string;
  executive_diagnosis?: string;
  score_explanation?: string;
  risk_level?: string;
  financial_score?: number;
  family_diagnosis?: {
    income?: number;
    expenses?: number;
    savings?: number;
    savings_rate?: number;
    liquidity_ratio?: number;
    summary?: string;
  };
  business_diagnosis?: {
    total_companies?: number;
    summary?: string;
  };
  detected_risks?: string[];
  responsible_recommendations?: string[];
  next_30_days?: string[];
  next_90_days?: string[];
  disclaimer?: string;
  responsible_disclaimer?: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
type TwinScenario = {
  scenario?: {
    income_change_pct?: number;
    expense_change_pct?: number;
    extra_savings_pct?: number;
    payoff_debt?: boolean;
  };
  current_state?: {
    income?: number;
    expenses?: number;
    savings?: number;
    monthly_debt_payment?: number;
    goal_progress?: number;
    financial_score?: number;
    risk_level?: string;
  };
  simulated_state?: {
    income?: number;
    expenses?: number;
    savings?: number;
    monthly_debt_payment?: number;
    goal_progress?: number;
    financial_score?: number;
    risk_level?: string;
  };
  risk_components?: Record<string, number>;
  score_difference?: number;
  risk_difference?: {
    from?: string;
    to?: string;
  };
  recommendations?: string[];
};

export default function Home() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [coachLoading, setCoachLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      if (!res.ok) {
        setError("No se pudo cargar el Dashboard de TRIAH.");
        return;
      }

      const json: Dashboard = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
      setError("Error cargando dashboard. Verifica backend y proxy.");
    } finally {
      setLoading(false);
    }
  }

  async function askCoach() {
    try {
      setCoachLoading(true);
      setError("");

      const res = await fetch("/api/coach", {
        method: "POST",
      });

      if (!res.ok) {
        setError("No se pudo generar el diagnóstico del coach financiero.");
        return;
      }

      const json: Coach = await res.json();
      setCoach(json);
    } catch (error) {
      console.error("Error coach:", error);
      setError("Error consultando AI Financial Coach.");
    } finally {
      setCoachLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const chartData = useMemo(() => buildCashFlowData(data), [data]);
  const kpis = useMemo(() => buildKpiCards(data), [data]);

  if (loading) return <LoadingState />;
  if (error && !data) {
    return <ErrorState message={error} onRetry={loadDashboard} />;
  }
  if (!data) return <EmptyState />;

  return (
    <main className={COLORS.page}>
      <section className={COLORS.shell}>
        <NavigationBar />

        <HeroSection
          data={data}
          onRefresh={loadDashboard}
          onCoach={askCoach}
          coachLoading={coachLoading}
        />

        {error && (
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200 text-sm">
            {error}
          </div>
        )}

        <KpiGrid cards={kpis} />

        <ExecutiveIntelligencePanel
          intelligence={data.executive_intelligence}
        />

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RiskScorePanel data={data} />

          <div className="xl:col-span-2">
            <CashFlowChart data={chartData} />
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RecommendationCenter
            risks={data.risks || []}
            recommendations={data.recommendations || []}
          />

          <ExecutiveSummary data={data} />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  <RiskComponents components={data.risk_components || {}} />

  <FinancialTwinPreview data={data} />
</section>

<WhatIfSimulator
  onScenarioCalculated={() => {
    loadDashboard();
  }}
/>

<FinancialTwinIntelligencePanel
  intelligence={data.financial_twin_intelligence}
/>

<AiCoachPanel
  coach={coach}
  onCoach={askCoach}
  coachLoading={coachLoading}
/>
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
    <nav className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={
            link.active
              ? "rounded-xl bg-white text-slate-950 px-5 py-3 font-bold shadow-lg shadow-white/10"
              : "rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-slate-300 hover:text-white hover:border-slate-600 transition"
          }
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

function HeroSection({
  data,
  onRefresh,
  onCoach,
  coachLoading,
}: {
  data: Dashboard;
  onRefresh: () => void;
  onCoach: () => void;
  coachLoading: boolean;
}) {
  const diagnosis = getFinancialDiagnosis(data);
  const riskBadge = getRiskBadge(data.risk_level);

  return (
    <header className={COLORS.hero}>
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
        <div className="space-y-5">
          <div>
            <p className="text-sm text-emerald-400 font-semibold tracking-[0.25em]">
              TRIAH FINTECH SAAS
            </p>

            <h1 className="text-4xl lg:text-6xl font-black mt-4 tracking-tight">
              CFO Digital Dashboard
            </h1>

            <p className="text-slate-300 mt-4 max-w-3xl text-base lg:text-lg">
              {diagnosis}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className={riskBadge}>{data.risk_level}</Badge>
            <Badge>Score {formatNumber(data.financial_score)}/100</Badge>
            <Badge>Liquidez {formatNumber(data.liquidity_ratio ?? 0)}x</Badge>
            <Badge>Ahorro {formatCurrency(data.savings)}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 min-w-[260px]">
          <a
            href="/api/pdf/executive"
            target="_blank"
            className="rounded-2xl bg-emerald-500 text-slate-950 px-6 py-4 font-black hover:bg-emerald-400 text-center transition"
          >
            Descargar PDF
          </a>

          <button
            onClick={onCoach}
            disabled={coachLoading}
            className="rounded-2xl bg-white text-slate-950 px-6 py-4 font-black hover:bg-slate-200 transition disabled:opacity-60"
          >
            {coachLoading ? "Analizando..." : "AI Coach"}
          </button>

          <button
            onClick={onRefresh}
            className="rounded-2xl border border-slate-700 px-6 py-4 font-bold text-slate-300 hover:text-white hover:border-slate-500 transition"
          >
            Actualizar
          </button>
        </div>
      </div>
    </header>
  );
}

function KpiGrid({ cards }: { cards: KpiCardData[] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <KpiCard key={card.title} card={card} />
      ))}
    </section>
  );
}

type KpiCardData = {
  title: string;
  value: string;
  helper: string;
  accent: string;
};

function KpiCard({ card }: { card: KpiCardData }) {
  return (
    <div
      title={card.helper}
      className={`${COLORS.cardHover} group hover:-translate-y-1 duration-300`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-400 group-hover:text-slate-300 transition">
          {card.title}
        </p>

        <span className={`h-3 w-3 rounded-full ${card.accent} shadow-lg`} />
      </div>

      <h2 className="text-3xl font-black mt-4 tracking-tight">
        {card.value}
      </h2>

      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-1 text-xs font-bold">
          Estable
        </span>

        <span className="text-xs text-slate-500">
          Actualizado hoy
        </span>
      </div>

      <p className="text-sm text-slate-500 mt-3">
        {card.helper}
      </p>
    </div>
  );
}


function RiskScorePanel({ data }: { data: Dashboard }) {
  const score = data.financial_score || 0;
  const width = Math.min(Math.max(score, 0), 100);
  const progressColor = getRiskProgressColor(data.risk_level);

  return (
    <div className={COLORS.card}>
      <p className="text-slate-400 text-sm">Financial Health Score</p>

      <div className="flex items-end gap-3 mt-3">
        <h2 className="text-6xl font-black">{formatNumber(score)}</h2>
        <p className="text-slate-500 mb-2">/100</p>
      </div>

      <p className={`inline-block mt-4 px-3 py-1 rounded-full border text-sm ${getRiskBadge(data.risk_level)}`}>
        {data.risk_level}
      </p>

      <div className="mt-6 h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} rounded-full`}
          style={{ width: `${width}%` }}
        />
      </div>

      <p className="text-slate-400 text-sm mt-5 leading-relaxed">
        Score calculado con liquidez, capacidad de ahorro, endeudamiento,
        estabilidad de gastos, metas y educación financiera.
      </p>
    </div>
  );
}

function CashFlowChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className={`${COLORS.card} hover:border-emerald-500/30 transition`}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black">Cash Flow Ejecutivo</h2>

          <p className="text-slate-400 text-sm mt-1">
            Lectura ejecutiva de ingresos, gastos y ahorro disponible.
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1 text-xs font-bold">
          Mensual
        </span>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${Number(value) / 1000000}M`}
            />

            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "16px",
                color: "#fff",
              }}
              cursor={{ fill: "rgba(16,185,129,0.08)" }}
            />

            <Bar
              dataKey="value"
              fill="#10b981"
              radius={[14, 14, 0, 0]}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecommendationCenter({
  risks,
  recommendations,
}: {
  risks: string[];
  recommendations: string[];
}) {
  return (
    <div className={COLORS.card}>
      <h2 className="text-2xl font-black mb-6">Centro de Decisiones</h2>

      <div className="grid grid-cols-1 gap-5">
        <InsightPanel
          title="Riesgos detectados"
          items={risks.length ? risks : ["Sin riesgos críticos registrados."]}
          color="red"
        />

        <InsightPanel
          title="Recomendaciones"
          items={
            recommendations.length
              ? recommendations
              : ["Mantener disciplina financiera y seguimiento mensual."]
          }
          color="emerald"
        />
      </div>
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
  const colorClass = color === "red" ? "text-red-300" : "text-emerald-300";

  return (
    <div>
      <h3 className={`text-lg font-black mb-3 ${colorClass}`}>{title}</h3>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-2xl bg-slate-950 border border-slate-800 p-4 text-sm text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskComponents({ components }: { components: Record<string, number> }) {
  const entries = Object.entries(components || {});

  return (
    <div className={COLORS.card}>
      <h2 className="text-2xl font-black mb-6">Risk Engine V2</h2>

      {entries.length === 0 ? (
        <p className="text-slate-400">Sin componentes disponibles.</p>
      ) : (
        <div className="space-y-5">
          {entries.map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">{formatLabel(key)}</span>
                <span className="font-bold">{formatNumber(value)}</span>
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
    <div className={COLORS.card}>
      <h2 className="text-2xl font-black mb-6">Resumen Ejecutivo</h2>

      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
        <p>
          TRIAH identifica un nivel de riesgo{" "}
          <span className="font-black text-white">{data.risk_level}</span> con
          un score financiero de{" "}
          <span className="font-black text-white">{data.financial_score}/100</span>.
        </p>

        <p>
          El hogar presenta una tasa de ahorro de{" "}
          <span className="font-black text-white">{formatPercentage(data.savings_rate)}</span>{" "}
          y una liquidez de{" "}
          <span className="font-black text-white">{formatNumber(data.liquidity_ratio ?? 0)}x</span>.
        </p>

        <p>
          El avance de metas está en{" "}
          <span className="font-black text-white">
            {formatPercentage(data.goal_progress_percentage)}
          </span>
          . Se recomienda mantener seguimiento mensual y priorizar objetivos
          familiares de alta importancia.
        </p>
      </div>
    </div>
  );
}

function FinancialTwinPreview({ data }: { data: Dashboard }) {
  const netPosition = data.savings - (data.monthly_debt_payment ?? 0);

  return (
    <div className={COLORS.card}>
      <h2 className="text-2xl font-black mb-6">Financial Twin Preview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MiniMetric label="Posición neta mensual" value={formatCurrency(netPosition)} />
        <MiniMetric label="Metas actuales" value={formatCurrency(data.current_goals ?? 0)} />
        <MiniMetric label="Meta total" value={formatCurrency(data.total_goals ?? 0)} />
        <MiniMetric label="Margen empresarial" value={formatCurrency(data.company_margin ?? 0)} />
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-xl font-black mt-2">{value}</p>
    </div>
  );
}

function ExecutiveIntelligencePanel({
  intelligence,
}: {
  intelligence?: Dashboard["executive_intelligence"];
}) {
  if (!intelligence) return null;

  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/20 border border-emerald-500/20 p-6 lg:p-8 shadow-2xl shadow-emerald-950/10">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <p className="text-sm text-emerald-400 font-bold tracking-[0.25em]">
            EXECUTIVE INTELLIGENCE
          </p>

          <h2 className="text-3xl font-black mt-3">
            Briefing Ejecutivo TRIAH
          </h2>

          <p className="text-slate-300 mt-4 max-w-4xl leading-relaxed">
            {intelligence.financial_story}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 min-w-[220px]">
          <p className="text-slate-400 text-sm">Diagnóstico</p>
          <p className="text-2xl font-black mt-2">
            {intelligence.executive_summary?.risk_level || "No calculado"}
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Score {intelligence.executive_summary?.score ?? 0}/100
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mt-8">
        <ExecutiveList
          title="Fortalezas"
          items={intelligence.strengths || []}
          color="emerald"
        />

        <ExecutiveList
          title="Debilidades"
          items={intelligence.weaknesses || []}
          color="yellow"
        />

        <ExecutiveList
          title="Oportunidades"
          items={intelligence.opportunities || []}
          color="cyan"
        />

        <ExecutiveList
          title="Prioridades"
          items={intelligence.priority_actions || []}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        {(intelligence.alerts || []).map((alert, index) => (
          <div
            key={index}
            className="rounded-2xl bg-slate-950 border border-slate-800 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-black text-white">{alert.title}</h3>

              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                {alert.level}
              </span>
            </div>

            <p className="text-slate-400 text-sm mt-3">{alert.impact}</p>

            <p className="text-emerald-300 text-sm mt-3 font-semibold">
              Acción: {alert.action}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExecutiveList({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "emerald" | "yellow" | "cyan" | "indigo";
}) {
  const colorMap = {
    emerald: "text-emerald-300",
    yellow: "text-yellow-300",
    cyan: "text-cyan-300",
    indigo: "text-indigo-300",
  };

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
      <h3 className={`font-black mb-4 ${colorMap[color]}`}>{title}</h3>

      <ul className="space-y-3 text-sm text-slate-300">
        {(items.length ? items : ["Sin información relevante."]).map(
          (item, index) => (
            <li key={index}>• {item}</li>
          )
        )}
      </ul>
    </div>
  );
}
function WhatIfSimulator({
  onScenarioCalculated,
}: {
  onScenarioCalculated?: () => void;
}) {
  const [incomeChangePct, setIncomeChangePct] = useState(0);
  const [expenseChangePct, setExpenseChangePct] = useState(0);
  const [extraSavingsPct, setExtraSavingsPct] = useState(0);
  const [payoffDebt, setPayoffDebt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<TwinScenario | null>(null);
  const [error, setError] = useState("");
  const hasScenarioInput =
  incomeChangePct !== 0 ||
  expenseChangePct !== 0 ||
  extraSavingsPct !== 0 ||
  payoffDebt;

  async function runScenario() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        income_change_pct: String(incomeChangePct),
        expense_change_pct: String(expenseChangePct),
        extra_savings_pct: String(extraSavingsPct),
        payoff_debt: String(payoffDebt),
      });

      const res = await fetch(`/api/twin?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setError("No se pudo simular el escenario financiero.");
        return;
      }

      const json: TwinScenario = await res.json();

setScenario(json);

if (onScenarioCalculated) {
  onScenarioCalculated();
}
    } catch (error) {
      console.error("Financial Twin error:", error);
      setError("Error ejecutando Financial Twin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/20 border border-cyan-500/20 p-6 lg:p-8 shadow-2xl shadow-cyan-950/10">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <p className="text-sm text-cyan-300 font-bold tracking-[0.25em]">
            FINANCIAL TWIN
          </p>

          <h2 className="text-3xl font-black mt-3">
            What-If Simulator
          </h2>

          <p className="text-slate-300 mt-3 max-w-3xl">
            Simula cambios hipotéticos en ingresos, gastos, ahorro y deuda para
            estimar el impacto sobre tu score financiero y nivel de riesgo.
          </p>
        </div>

        <button
          onClick={runScenario}
          disabled={loading}
          className="rounded-2xl bg-cyan-400 text-slate-950 px-6 py-4 font-black hover:bg-cyan-300 disabled:opacity-60 transition"
        >
          {loading ? "Simulando..." : "Simular escenario"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mt-8">
        <SimulatorInput
          label="Cambio ingresos"
          value={incomeChangePct}
          min={-50}
          max={50}
          suffix="%"
          onChange={setIncomeChangePct}
        />

        <SimulatorInput
          label="Cambio gastos"
          value={expenseChangePct}
          min={-50}
          max={50}
          suffix="%"
          onChange={setExpenseChangePct}
        />

        <SimulatorInput
          label="Ahorro adicional"
          value={extraSavingsPct}
          min={0}
          max={50}
          suffix="%"
          onChange={setExtraSavingsPct}
        />

        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
          <p className="text-slate-400 text-sm">Pagar deuda total</p>

          <button
            onClick={() => setPayoffDebt(!payoffDebt)}
            className={
              payoffDebt
                ? "mt-4 w-full rounded-xl bg-emerald-500 text-slate-950 px-4 py-3 font-black"
                : "mt-4 w-full rounded-xl bg-slate-900 border border-slate-700 text-slate-300 px-4 py-3 font-black"
            }
          >
            {payoffDebt ? "Sí" : "No"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
          {error}
        </div>
      )}

            {scenario && (
        <WhatIfResultPanel scenario={scenario} />
      )}
    </section>
  );
}
    
function SimulatorInput({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="font-black text-white">
          {value}
          {suffix}
        </p>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full mt-5 accent-cyan-400"
      />
    </div>
  );
}
function WhatIfResultPanel({ scenario }: { scenario: TwinScenario }) {
  return (
    <div className="mt-8 rounded-[2rem] bg-slate-950 border border-cyan-500/20 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <p className="text-sm text-cyan-300 font-bold tracking-[0.25em]">
            RESULTADO DEL ESCENARIO
          </p>

          <h3 className="text-2xl font-black mt-2">
            Impacto financiero simulado
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 px-5 py-4">
          <p className="text-slate-400 text-sm">Cambio de score</p>
          <p className="text-3xl font-black text-cyan-300">
            {formatNumber(scenario.score_difference ?? 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-6">
        <ScenarioBox title="Estado actual" state={scenario.current_state} />

        <ScenarioBox title="Estado simulado" state={scenario.simulated_state} />

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <h4 className="text-xl font-black mb-4">Lectura ejecutiva</h4>

          <p className="text-slate-400 text-sm">Cambio de riesgo</p>

          <p className="text-lg font-black mt-2">
            {scenario.risk_difference?.from || "N/A"} →{" "}
            {scenario.risk_difference?.to || "N/A"}
          </p>

          <div className="mt-5">
            <p className="text-cyan-300 font-black mb-3">
              Recomendaciones
            </p>

            <ul className="space-y-2 text-sm text-slate-300">
              {(scenario.recommendations || []).map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioBox({
  title,
  state,
}: {
  title: string;
  state?: Record<string, unknown>;
}) {
  const entries = Object.entries(state || {});

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
      <h3 className="text-xl font-black mb-4">{title}</h3>

      {entries.length === 0 ? (
        <p className="text-slate-500 text-sm">Sin datos disponibles.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2"
            >
              <span className="text-slate-400 text-sm">
                {formatLabel(key)}
              </span>

              <span className="text-white text-sm font-bold text-right">
                {typeof value === "number"
                  ? formatNumber(value)
                  : String(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function FinancialTwinIntelligencePanel({
  intelligence,
}: {
  intelligence?: FinancialTwinIntelligence;
}) {
  if (!intelligence?.financial_twin) return null;

  const cases = [
    {
      title: "Posición actual",
      data: intelligence.financial_twin.current_position,
      accent: "emerald",
    },
    {
      title: "Caso esperado",
      data: intelligence.financial_twin.expected_case,
      accent: "cyan",
    },
    {
      title: "Mejor caso",
      data: intelligence.financial_twin.best_case,
      accent: "indigo",
    },
    {
      title: "Peor caso",
      data: intelligence.financial_twin.worst_case,
      accent: "red",
    },
    {
      title: "Caso recomendado",
      data: intelligence.financial_twin.recommended_case,
      accent: "emerald",
    },
  ];

  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/20 border border-indigo-500/20 p-6 lg:p-8 shadow-2xl shadow-indigo-950/10">
      <div>
        <p className="text-sm text-indigo-300 font-bold tracking-[0.25em]">
          FINANCIAL TWIN INTELLIGENCE
        </p>

        <h2 className="text-3xl font-black mt-3">
          Escenarios financieros inteligentes
        </h2>

        <p className="text-slate-300 mt-3 max-w-4xl">
          TRIAH proyecta distintos escenarios para comparar tu posición actual,
          un escenario esperado, un escenario optimista, un escenario adverso y
          una ruta recomendada.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mt-8">
        {cases.map((item) => (
          <TwinCaseCard
            key={item.title}
            title={item.title}
            data={item.data}
            accent={item.accent}
          />
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-6">
        {intelligence.disclaimer}
      </p>
    </section>
  );
}
function TwinCaseCard({
  title,
  data,
  accent,
}: {
  title: string;
  data?: FinancialTwinCase;
  accent: string;
}) {
  if (!data) return null;

  const accentClass =
    accent === "red"
      ? "border-red-500/30 text-red-300"
      : accent === "cyan"
      ? "border-cyan-500/30 text-cyan-300"
      : accent === "indigo"
      ? "border-indigo-500/30 text-indigo-300"
      : "border-emerald-500/30 text-emerald-300";

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 hover:border-slate-600 transition">
      <div className="flex items-center justify-between gap-3">
        <h3 className={`font-black ${accentClass}`}>
          {title}
        </h3>

        <span className={`rounded-full border px-3 py-1 text-xs ${accentClass}`}>
          {data.risk_level}
        </span>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <TwinMetric label="Score" value={`${formatNumber(data.financial_score)}/100`} />
        <TwinMetric label="Liquidez" value={`${formatNumber(data.liquidity_ratio)}x`} />
        <TwinMetric label="Ahorro" value={formatCurrency(data.savings)} />
        <TwinMetric label="Deuda mensual" value={formatCurrency(data.monthly_debt_payment)} />
        <TwinMetric label="Avance metas" value={formatPercentage(data.goal_progress)} />
        <TwinMetric label="Posición neta" value={formatCurrency(data.estimated_net_position)} />
      </div>

      <div className="mt-5 border-t border-slate-800 pt-4">
        <p className="text-xs font-black text-slate-400 mb-3">
          Recomendaciones
        </p>

        <ul className="space-y-2 text-xs text-slate-300">
          {(data.recommendations || []).slice(0, 3).map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function TwinMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-white text-right">{value}</span>
    </div>
  );
}
function AiCoachPanel({
  coach,
  onCoach,
  coachLoading,
}: {
  coach: Coach | null;
  onCoach: () => void;
  coachLoading: boolean;
}) {
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hola, soy TRIAH AI Financial Coach. Puedo ayudarte a entender tu score, tus riesgos, tus metas, tu flujo de caja y posibles escenarios financieros.",
    },
  ]);

  async function askCustomQuestion(customQuestion?: string) {
    const finalQuestion = customQuestion || question;

    if (!finalQuestion.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: finalQuestion,
      },
    ]);



    setQuestion("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          household_id: 1,
          question: finalQuestion,
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo consultar el AI Coach.");
      }

      const json: Coach = await res.json();

      const answer =
        json.executive_diagnosis ||
        json.score_explanation ||
        json.family_diagnosis?.summary ||
        "TRIAH analizó tu información, pero no pudo generar una respuesta detallada.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "No pude generar la respuesta en este momento. Verifica que el backend esté activo y vuelve a intentarlo.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  const quickPrompts = [
    "¿Cómo puedo subir mi score financiero?",
    "¿Qué riesgos debo vigilar este mes?",
    "¿Cómo mejorar mi liquidez?",
    "¿Qué hago con mis deudas?",
    "¿Cómo acelerar mis metas financieras?",
    "Dame un plan financiero para 30 días.",
  ];

  return (
    <section className={COLORS.ai}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <p className="text-sm text-indigo-300 font-bold tracking-[0.25em]">
            AI FINANCIAL COACH
          </p>

          <h2 className="text-3xl font-black mt-3">
            CFO Conversacional TRIAH
          </h2>

          <p className="text-slate-300 mt-2 max-w-3xl">
            Pregunta sobre score, liquidez, deuda, metas, ahorro, riesgos y
            decisiones financieras. El análisis es educativo y se basa en tus
            datos registrados.
          </p>
        </div>

        <button
          onClick={onCoach}
          disabled={coachLoading}
          className="rounded-2xl bg-white text-slate-950 px-6 py-4 font-black disabled:opacity-60 hover:bg-slate-200 transition"
        >
          {coachLoading ? "Analizando..." : "Diagnóstico rápido"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2 rounded-3xl bg-slate-950 border border-slate-800 p-5">
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {messages.map((message, index) => (
              <ChatBubble key={index} message={message} />
            ))}

            {chatLoading && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-sm text-slate-300">
                TRIAH está analizando tus datos...
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col md:flex-row gap-3">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  askCustomQuestion();
                }
              }}
              placeholder="Escribe tu pregunta financiera..."
              className="flex-1 rounded-2xl bg-slate-900 border border-slate-700 px-5 py-4 text-white outline-none focus:border-emerald-500"
            />

            <button
              onClick={() => askCustomQuestion()}
              disabled={chatLoading}
              className="rounded-2xl bg-emerald-500 text-slate-950 px-6 py-4 font-black hover:bg-emerald-400 disabled:opacity-60"
            >
              Enviar
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-5">
          <h3 className="text-xl font-black mb-4">Preguntas inteligentes</h3>

          <div className="space-y-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => askCustomQuestion(prompt)}
                className="w-full text-left rounded-2xl bg-slate-900 border border-slate-800 p-4 text-sm text-slate-300 hover:border-emerald-500/50 hover:text-white transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {coach && (
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-5">
          <CoachBox
            title="Diagnóstico Ejecutivo"
            items={[
              coach.executive_diagnosis ||
                coach.family_diagnosis?.summary ||
                "Diagnóstico no disponible.",
            ]}
          />

          <CoachBox
            title="Explicación del Score"
            items={[
              coach.score_explanation ||
                `Score financiero actual: ${coach.financial_score ?? "N/A"}`,
            ]}
          />

          <CoachBox title="Riesgos Detectados" items={coach.detected_risks || []} />
          <CoachBox title="Plan 30 días" items={coach.next_30_days || []} />
          <CoachBox title="Plan 90 días" items={coach.next_90_days || []} />
          <CoachBox
            title="Recomendaciones Responsables"
            items={coach.responsible_recommendations || []}
          />
        </div>
      )}
    </section>
  );
}
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl bg-emerald-500 text-slate-950 p-4 text-sm font-semibold shadow-lg shadow-emerald-950/30"
            : "max-w-[85%] rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 p-4 text-sm leading-relaxed shadow-lg shadow-black/20"
        }
      >
        <div className="flex items-start gap-3">
          {!isUser && (
            <span className="h-8 w-8 shrink-0 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xs font-black text-indigo-200">
              AI
            </span>
          )}

          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
}

function CoachBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
      <p className="text-emerald-400 text-sm font-black mb-3">{title}</p>

      <ul className="space-y-2 text-sm text-slate-200">
        {(items.length ? items : ["Sin información disponible."]).map(
          (item, index) => (
            <li key={index}>• {item}</li>
          )
        )}
      </ul>
    </div>
  );
}

function LoadingState() {
  const skeletons = Array.from({ length: 12 });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
      <section className="max-w-7xl mx-auto space-y-10 animate-pulse">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-12 w-32 rounded-xl bg-slate-800"
            />
          ))}
        </div>

        <div className="h-64 rounded-[2rem] bg-slate-900 border border-slate-800" />

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {skeletons.map((_, index) => (
            <div
              key={index}
              className="h-36 rounded-3xl bg-slate-900 border border-slate-800"
            />
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="h-80 rounded-3xl bg-slate-900 border border-slate-800" />
          <div className="xl:col-span-2 h-80 rounded-3xl bg-slate-900 border border-slate-800" />
        </section>
      </section>
    </main>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 flex items-center justify-center">
      <div className="rounded-3xl bg-red-950/40 border border-red-800 p-8 max-w-xl">
        <h1 className="text-3xl font-black text-red-300">Error cargando TRIAH</h1>
        <p className="text-red-100 mt-4">{message}</p>

        <button
          onClick={onRetry}
          className="inline-block mt-6 rounded-xl bg-white text-slate-950 px-5 py-3 font-black"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 flex items-center justify-center">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center">
        <h1 className="text-3xl font-black">Sin datos financieros</h1>
        <p className="text-slate-400 mt-4">
          Registra ingresos, gastos, deudas y metas para activar TRIAH.
        </p>
      </div>
    </main>
  );
}

function Badge({
  children,
  className = "bg-slate-900 text-slate-300 border-slate-700",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`px-3 py-1 rounded-full border text-sm ${className}`}>
      {children}
    </span>
  );
}

function buildKpiCards(data: Dashboard | null): KpiCardData[] {
  if (!data) return [];

  return [
    {
      title: "Ingresos",
      value: formatCurrency(data.income),
      helper: "Ingreso mensual consolidado",
      accent: "bg-emerald-400",
    },
    {
      title: "Gastos",
      value: formatCurrency(data.expenses),
      helper: "Egresos mensuales actuales",
      accent: "bg-red-400",
    },
    {
      title: "Ahorro",
      value: formatCurrency(data.savings),
      helper: "Excedente financiero mensual",
      accent: "bg-cyan-400",
    },
    {
      title: "Tasa de ahorro",
      value: formatPercentage(data.savings_rate),
      helper: "Capacidad de ahorro sobre ingresos",
      accent: "bg-emerald-400",
    },
    {
      title: "Score financiero",
      value: `${formatNumber(data.financial_score)}/100`,
      helper: "Resultado Risk Engine V2",
      accent: "bg-indigo-400",
    },
    {
      title: "Riesgo",
      value: data.risk_level,
      helper: "Clasificación financiera actual",
      accent: getRiskDot(data.risk_level),
    },
    {
      title: "Avance metas",
      value: formatPercentage(data.goal_progress_percentage),
      helper: "Progreso hacia objetivos financieros",
      accent: "bg-yellow-400",
    },
    {
      title: "Deuda total",
      value: formatCurrency(data.total_debt ?? 0),
      helper: "Obligaciones financieras registradas",
      accent: "bg-orange-400",
    },
    {
      title: "Pago mensual deuda",
      value: formatCurrency(data.monthly_debt_payment ?? 0),
      helper: "Carga financiera mensual",
      accent: "bg-orange-400",
    },
    {
      title: "Liquidez",
      value: `${formatNumber(data.liquidity_ratio ?? 0)}x`,
      helper: "Cobertura frente al gasto mensual",
      accent: "bg-emerald-400",
    },
    {
      title: "Empresas",
      value: formatNumber(data.total_companies ?? 0),
      helper: "Unidades empresariales registradas",
      accent: "bg-cyan-400",
    },
    {
      title: "Hogares",
      value: formatNumber(data.total_households ?? 0),
      helper: "Perfiles familiares activos",
      accent: "bg-indigo-400",
    },
  ];
}

function buildCashFlowData(data: Dashboard | null) {
  if (!data) return [];

  return [
    { name: "Ingresos", value: data.income },
    { name: "Gastos", value: data.expenses },
    { name: "Ahorro", value: data.savings },
  ];
}

function getFinancialDiagnosis(data: Dashboard) {
  if (data.financial_score >= 90) {
    return "Tu posición financiera es escalable: TRIAH identifica una alta capacidad para sostener metas, liquidez y crecimiento patrimonial.";
  }

  if (data.financial_score >= 75) {
    return "Tu salud financiera es sólida. El foco debe estar en consolidar metas, mantener liquidez y optimizar decisiones de deuda.";
  }

  if (data.financial_score >= 60) {
    return "Tu posición financiera es estable, pero requiere seguimiento mensual para fortalecer metas, liquidez y control de gastos.";
  }

  if (data.financial_score >= 40) {
    return "Tu posición financiera es vulnerable. TRIAH recomienda priorizar liquidez, ahorro automático y reducción de presión financiera.";
  }

  return "Tu posición financiera requiere atención prioritaria. El foco debe ser estabilizar ingresos, reducir gastos críticos y organizar deudas.";
}

function getRiskBadge(level: string) {
  if (level === "Escalable") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
  if (level === "Saludable") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (level === "Estable") return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  if (level === "Vulnerable") return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  return "bg-red-500/20 text-red-300 border-red-500/30";
}

function getRiskProgressColor(level: string) {
  if (level === "Escalable") return "bg-cyan-500";
  if (level === "Saludable") return "bg-emerald-500";
  if (level === "Estable") return "bg-yellow-500";
  if (level === "Vulnerable") return "bg-orange-500";
  return "bg-red-500";
}

function getRiskDot(level: string) {
  if (level === "Escalable") return "bg-cyan-400";
  if (level === "Saludable") return "bg-emerald-400";
  if (level === "Estable") return "bg-yellow-400";
  if (level === "Vulnerable") return "bg-orange-400";
  return "bg-red-400";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatPercentage(value: number) {
  return `${formatNumber(value || 0)}%`;
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}