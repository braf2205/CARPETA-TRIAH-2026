"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTransactionPage() {
  const router = useRouter();

  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function createTransaction() {
    if (!type || !category || !description || !amount) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    setLoading(true);

    const payload = {
      type,
      category,
      description,
      amount: Number(amount),
    };

    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      alert(`Error creando transacción: ${response.status} - ${text}`);
      setLoading(false);
      return;
    }

    router.push("/transactions");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <nav className="flex flex-wrap gap-4 mb-10">
        <a href="/" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Dashboard
        </a>

        <a href="/transactions" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Transacciones
        </a>

        <a href="/transactions/new" className="rounded-xl bg-white text-slate-950 px-5 py-3 font-bold">
          Nueva Transacción
        </a>
      </nav>

      <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Nueva Transacción</h1>

        <p className="text-slate-400 mb-8">
          Registra ingresos y gastos para alimentar el dashboard financiero de TRIAH.
        </p>

        <div className="space-y-4">
          <select
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
          </select>

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={createTransaction}
            disabled={loading}
            className="w-full bg-white text-slate-950 px-6 py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Transacción"}
          </button>
        </div>
      </div>
    </main>
  );
}