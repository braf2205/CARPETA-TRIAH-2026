"use client";

import { useEffect, useState } from "react";

type Debt = {
  id: number;
  name: string;
  amount: number;
  monthly_payment: number;
  interest_rate: number;
};

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    loadDebts();
  }, []);

  async function loadDebts() {
    try {
      const res = await fetch("/api/debts");

      const data = await res.json();

      setDebts(data);
    } catch (error) {
      console.error("Error cargando deudas:", error);
    }
  }

  const totalDebt = debts.reduce(
    (sum, debt) => sum + debt.amount,
    0
  );

  const totalMonthly = debts.reduce(
    (sum, debt) => sum + debt.monthly_payment,
    0
  );

  const averageRate =
    debts.length > 0
      ? debts.reduce(
          (sum, debt) => sum + debt.interest_rate,
          0
        ) / debts.length
      : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Debt Management
      </h1>

      <section className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <p className="text-slate-400">
            Deuda Total
          </p>

          <h2 className="text-5xl font-bold mt-2">
            $
            {new Intl.NumberFormat("es-CO").format(
              totalDebt
            )}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <p className="text-slate-400">
            Cuotas Mensuales
          </p>

          <h2 className="text-5xl font-bold mt-2">
            $
            {new Intl.NumberFormat("es-CO").format(
              totalMonthly
            )}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <p className="text-slate-400">
            Tasa Promedio
          </p>

          <h2 className="text-5xl font-bold mt-2">
            {averageRate.toFixed(2)}%
          </h2>
        </div>

      </section>

      <section className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

        <h2 className="text-3xl font-bold mb-6">
          Deudas Registradas
        </h2>

        <table className="w-full border-separate border-spacing-y-3">

          <thead>

            <tr className="text-slate-400">

              <th className="text-left px-4 py-3">
                Entidad
              </th>

              <th className="text-left px-4 py-3">
                Saldo
              </th>

              <th className="text-left px-4 py-3">
                Cuota Mensual
              </th>

              <th className="text-left px-4 py-3">
                Tasa EA
              </th>

            </tr>

          </thead>

          <tbody>

            {debts.map((debt) => (

              <tr
                key={debt.id}
                className="bg-slate-800"
              >

                <td className="px-4 py-4 rounded-l-xl">
                  {debt.name}
                </td>

                <td className="px-4 py-4">
                  $
                  {new Intl.NumberFormat(
                    "es-CO"
                  ).format(debt.amount)}
                </td>

                <td className="px-4 py-4">
                  $
                  {new Intl.NumberFormat(
                    "es-CO"
                  ).format(debt.monthly_payment)}
                </td>

                <td className="px-4 py-4 rounded-r-xl">
                  {debt.interest_rate}%
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </section>

    </main>
  );
}