"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Transaction = {
  id: number;
  amount: number;
  type: string;
  category: string;
  description: string;
  created_at: string;
};

type Goal = {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
};

type AnalyticsData = {
  transactions: Transaction[];
  goals: Goal[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    transactions: [],
    goals: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const transactionsRes = await fetch("/api/transactions");
        const goalsRes = await fetch("/api/goals");

        const transactions = await transactionsRes.json();
        const goals = await goalsRes.json();

        setData({
          transactions,
          goals,
        });
      } catch (error) {
        console.error("Error cargando analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const income = data.transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = data.transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const savings = income - expenses;

    const savingsRate =
      income > 0 ? Number(((savings / income) * 100).toFixed(1)) : 0;

    const totalGoalTarget = data.goals.reduce(
      (sum, goal) => sum + goal.target_amount,
      0
    );

    const totalGoalCurrent = data.goals.reduce(
      (sum, goal) => sum + goal.current_amount,
      0
    );

    const goalProgress =
      totalGoalTarget > 0
        ? Number(((totalGoalCurrent / totalGoalTarget) * 100).toFixed(2))
        : 0;

    const healthScore = Math.min(
      100,
      Math.max(0, Math.round(savingsRate * 0.6 + goalProgress * 0.4))
    );

    const riskLevel =
      healthScore >= 80
        ? "Saludable"
        : healthScore >= 60
        ? "Moderado"
        : "Alto riesgo";

    const expenseByCategory = data.transactions
      .filter((item) => item.type === "expense")
      .reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {});

    const expenseChartData = Object.entries(expenseByCategory).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    const incomeExpenseData = [
      {
        name: "Ingresos",
        value: income,
      },
      {
        name: "Gastos",
        value: expenses,
      },
      {
        name: "Ahorro",
        value: savings,
      },
    ];

    const goalChartData = data.goals.map((goal) => ({
      name: goal.title,
      avance:
        goal.target_amount > 0
          ? Number(((goal.current_amount / goal.target_amount) * 100).toFixed(1))
          : 0,
    }));

    return {
      income,
      expenses,
      savings,
      savingsRate,
      totalGoalTarget,
      totalGoalCurrent,
      goalProgress,
      healthScore,
      riskLevel,
      expenseChartData,
      incomeExpenseData,
      goalChartData,
    };
  }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-10">
        <h1 className="text-3xl font-bold">Cargando Analytics TRIAH...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <nav className="flex flex-wrap gap-4 mb-10">
        <a href="/" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-slate-300 hover:text-white">
          Dashboard
        </a>

        <a href="/transactions" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-slate-300 hover:text-white">
          Transacciones
        </a>

        <a href="/goals" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-slate-300 hover:text-white">
          Metas
        </a>

        <a href="/companies" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-slate-300 hover:text-white">
          Empresas
        </a>

        <a href="/analytics" className="rounded-xl bg-white text-slate-950 px-5 py-3 font-bold">
          Analytics
        </a>
      </nav>

      <header className="mb-10">
        <h1 className="text-5xl font-bold">TRIAH Financial Analytics</h1>

        <p className="text-slate-400 mt-3">
          Inteligencia financiera ejecutiva basada en ingresos, gastos y metas reales.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Ingresos Totales" value={analytics.income} />
        <MetricCard title="Gastos Totales" value={analytics.expenses} />
        <MetricCard title="Ahorro Neto" value={analytics.savings} />
        <MetricCard title="Tasa de Ahorro" value={`${analytics.savingsRate}%`} />
        <MetricCard title="Avance de Metas" value={`${analytics.goalProgress}%`} />
        <MetricCard title="Health Score" value={`${analytics.healthScore}/100`} />
        <MetricCard title="Nivel de Riesgo" value={analytics.riskLevel} />
        <MetricCard title="Meta Total" value={analytics.totalGoalTarget} />
        <MetricCard title="Meta Acumulada" value={analytics.totalGoalCurrent} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <ChartCard title="Ingresos vs Gastos">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.incomeExpenseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avance por Meta">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.goalChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avance" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución de Gastos">
          {analytics.expenseChartData.length === 0 ? (
            <p className="text-slate-400">No hay gastos registrados.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.expenseChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {analytics.expenseChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <h2 className="text-2xl font-bold mb-4">Diagnóstico Ejecutivo</h2>

          <div className="space-y-4 text-slate-300">
            <p>
              TRIAH identifica ingresos por{" "}
              <strong className="text-white">
                {formatCurrency(analytics.income)}
              </strong>{" "}
              y gastos por{" "}
              <strong className="text-white">
                {formatCurrency(analytics.expenses)}
              </strong>.
            </p>

            <p>
              El ahorro neto actual es de{" "}
              <strong className="text-white">
                {formatCurrency(analytics.savings)}
              </strong>{" "}
              con una tasa de ahorro del{" "}
              <strong className="text-white">
                {" "}
                {analytics.savingsRate}%.
              </strong>
            </p>

            <p>
              El avance consolidado de metas es de{" "}
              <strong className="text-white">
                {analytics.goalProgress}%.
              </strong>
            </p>

            <p>
              El Health Score financiero calculado es{" "}
              <strong className="text-white">
                {analytics.healthScore}/100
              </strong>{" "}
              con nivel de riesgo{" "}
              <strong className="text-white">
                {analytics.riskLevel}.
              </strong>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
      <p className="text-slate-400">{title}</p>

      <h2 className="text-3xl font-bold mt-2">
        {typeof value === "number" ? formatCurrency(value) : value}
      </h2>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="h-80">{children}</div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO").format(value);
}
<a
  href="/analytics"
  className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-slate-300 hover:text-white"
>
  Analytics
</a>
