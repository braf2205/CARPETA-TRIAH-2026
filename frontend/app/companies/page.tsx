"use client";

import { useEffect, useState } from "react";

type Company = {
  id: number;
  legal_name: string;
  name: string;
  industry: string | null;
  country?: string | null;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    async function loadCompanies() {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data);
    }

    loadCompanies();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <nav className="flex gap-4 mb-10">
        <a href="/" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Dashboard
        </a>
        <a href="/debts" className="rounded-xl bg-slate-900 border border-slate-800 px-5 py-3">
          Deudas
        </a>
        <a href="/companies/new" className="rounded-xl bg-white text-slate-950 px-5 py-3 font-bold">
          Nueva Empresa
        </a>
      </nav>

      <h1 className="text-4xl font-bold mb-8">Companies</h1>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <h2 className="text-2xl font-bold mb-4">Empresas Registradas</h2>

        {companies.length === 0 ? (
          <p className="text-slate-400">No hay empresas registradas.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Sector</th>
                <th className="pb-3">País</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-t border-slate-800">
                  <td className="py-3">{company.legal_name || company.name}</td>
                  <td className="py-3">{company.industry || "No definido"}</td>
                  <td className="py-3">{company.country || "Colombia"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}