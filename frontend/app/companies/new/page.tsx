"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCompanyPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  async function createCompany() {
    if (!name || !sector || !country) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    setLoading(true);

    const payload = {
  legal_name: name,
  name,
  industry: sector,
  annual_revenue: 0,
  monthly_expenses: 0,
  employees: 0,
};

    const response = await fetch("/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      alert(`Error creando empresa: ${response.status} - ${text}`);
      setLoading(false);
      return;
    }

    router.push("/companies");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <nav className="flex flex-wrap gap-4 mb-10">
        <a
          href="/"
          className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-slate-300 hover:text-white"
        >
          Dashboard
        </a>

        <a
          href="/companies"
          className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-slate-300 hover:text-white"
        >
          Empresas
        </a>

        <a
          href="/companies/new"
          className="rounded-xl bg-white text-slate-950 px-5 py-3 font-bold"
        >
          Nueva Empresa
        </a>
      </nav>

      <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2">Nueva Empresa</h1>

        <p className="text-slate-400 mb-8">
          Registra empresas o clientes para el módulo financiero empresarial de TRIAH.
        </p>

        <div className="space-y-4">
          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
            placeholder="Nombre empresa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
            placeholder="Sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />

          <input
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
            placeholder="País"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <button
            onClick={createCompany}
            disabled={loading}
            className="w-full bg-white text-slate-950 px-6 py-4 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Empresa"}
          </button>
        </div>
      </div>
    </main>
  );
}