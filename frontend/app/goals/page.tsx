"use client";

import { useEffect, useState } from "react";

type Goal = {
  id: number;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    async function loadGoals() {
      const res = await fetch("/api/goals");
      const data = await res.json();
      setGoals(data);
    }

    loadGoals();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <nav className="flex flex-wrap gap-4 mb-10">
        <a href="/" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Dashboard
        </a>

        <a href="/companies" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Empresas
        </a>

        <a href="/transactions" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Transacciones
        </a>

        <a href="/goals" className="rounded-xl bg-white text-slate-950 px-5 py-3 font-bold">
          Metas
        </a>

        <a href="/goals/new" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Nueva Meta
        </a>
      </nav>

      <h1 className="text-5xl font-bold mb-3">Metas Financieras</h1>

      <p className="text-slate-400 mb-10">
        Seguimiento de objetivos financieros personales y empresariales.
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = Math.min(
            (goal.current_amount / goal.target_amount) * 100,
            100
          );

          return (
            <div
              key={goal.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6"
            >
              <h2 className="text-2xl font-bold mb-4">{goal.title}</h2>

              <div className="space-y-2 text-slate-300">
                <p>
                  Meta:{" "}
                  <span className="font-bold text-white">
                    {new Intl.NumberFormat("es-CO").format(goal.target_amount)}
                  </span>
                </p>

                <p>
                  Actual:{" "}
                  <span className="font-bold text-white">
                    {new Intl.NumberFormat("es-CO").format(goal.current_amount)}
                  </span>
                </p>

                <p>
                  Fecha objetivo:{" "}
                  <span className="font-bold text-white">
                    {goal.target_date?.slice(0, 10)}
                  </span>
                </p>
              </div>

              <div className="mt-6 h-4 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-xl font-bold">
                {progress.toFixed(1)}%
              </p>
            </div>
          );
        })}
      </section>
    </main>
  );
}