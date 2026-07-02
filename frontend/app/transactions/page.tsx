"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: number;
  amount: number;
  type: string;
  category: string;
  description: string;
  created_at: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadTransactions() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    }

    loadTransactions();
  }, []);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = income - expenses;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <nav className="flex flex-wrap gap-4 mb-10">
        <a href="/" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Dashboard
        </a>
        <a href="/debts" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Deudas
        </a>
        <a href="/companies" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Empresas
        </a>
        <a href="/transactions" className="rounded-xl bg-white text-slate-950 px-5 py-3 font-bold">
          Transacciones
        </a>
      </nav>

      <h1 className="text-4xl font-bold mb-8">Transactions</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Ingresos" value={income} />
        <Card title="Gastos" value={expenses} />
        <Card title="Balance" value={balance} />
      </section>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <h2 className="text-2xl font-bold mb-4">Movimientos Registrados</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="pb-3">Tipo</th>
              <th className="pb-3">Categoría</th>
              <th className="pb-3">Descripción</th>
              <th className="pb-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="border-t border-slate-800">
                <td className="py-3">{item.type}</td>
                <td className="py-3">{item.category}</td>
                <td className="py-3">{item.description}</td>
                <td className="py-3">
                  {new Intl.NumberFormat("es-CO").format(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
      <p className="text-slate-400">{title}</p>
      <h2 className="text-3xl font-bold mt-2">
        {new Intl.NumberFormat("es-CO").format(value)}
      </h2>
    </div>
  );
}
<a href="/transactions/new" className="rounded-xl bg-white text-slate-950 px-5 py-3 font-bold">
  Nueva Transacción
</a>