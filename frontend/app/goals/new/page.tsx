"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewGoalPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function createGoal() {
    if (!title || !targetAmount || !currentAmount || !targetDate) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    setLoading(true);

    const payload = {
      title,
      target_amount: Number(targetAmount),
      current_amount: Number(currentAmount),
      target_date: targetDate,
    };

    const response = await fetch("/api/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      alert(`Error creando meta: ${response.status} - ${text}`);
      setLoading(false);
      return;
    }

    router.push("/goals");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <nav className="flex flex-wrap gap-4 mb-10">
        <a href="/" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Dashboard
        </a>

        <a href="/goals" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Metas
        </a>

        <a href="/goals/new" className="rounded-xl bg-white text-slate-950 px-5 py-3 font-bold">
          Nueva Meta
        </a>
      </nav>

      <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Nueva Meta</h1>

        <p className="text-slate-400 mb-8">
          Crea una meta financiera y haz seguimiento automático del avance.
        </p>

        <div className="space-y-4">
          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Título de la meta"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Monto objetivo"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Monto actual"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />

          <input
            type="date"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <button
            onClick={createGoal}
            disabled={loading}
            className="w-full bg-white text-slate-950 px-6 py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Meta"}
          </button>
        </div>
      </div>
    </main>
  );
}