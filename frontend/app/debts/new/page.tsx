"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDebtPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");

  async function createDebt() {
    const payload = {
   name,
   lender: name,
   amount: Number(amount),
   monthly_payment: Number(monthlyPayment),
   interest_rate: Number(interestRate),
};

    const response = await fetch("/api/debts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      alert(`Error creando deuda: ${response.status} - ${text}`);
      return;
    }

    router.push("/debts");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-6">Nueva Deuda</h1>

        <div className="space-y-4">
          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Entidad financiera"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Saldo"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Cuota mensual"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
            placeholder="Tasa EA"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />

          <button
            onClick={createDebt}
            className="w-full bg-white text-slate-950 px-6 py-4 rounded-xl font-bold"
          >
            Guardar Deuda
          </button>
        </div>
      </div>
    </main>
  );
}
