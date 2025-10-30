"use client";

import { useEffect, useMemo, useState } from "react";
import { getDemoCases } from "@/components/cases/_demoStore";
import { getContacts } from "@/components/contacts/_contactStore";
import Button from "@/components/ui/Button";

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-border/50 bg-[var(--bg-elev)] p-4 flex items-center gap-4">
      <div className="rounded-full p-3 bg-foreground/10">{icon}</div>
      <div>
        <div className="text-sm text-muted">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
        active ? "bg-primary text-black" : "bg-foreground/5 text-muted hover:bg-foreground/10"
      }`}
    >
      {label}
    </button>
  );
}

const FMT = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function FinancePage() {
  const [active, setActive] = useState("case"); // 'case' | 'client' | 'expense'
  const [cases, setCases] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // demo fetch
  useEffect(() => {
    setLoading(true);
    setCases(getDemoCases());
    setContacts(getContacts());
    setLoading(false);
  }, []);

  const contactMap = useMemo(() => {
    const m = new Map();
    contacts.forEach((c) => m.set(c.id, c));
    return m;
  }, [contacts]);

  const data = useMemo(() => {
    let totalBilled = 0;
    let totalOutstanding = 0;
    let totalExpenses = 0;

    const caseRows = [];
    const clients = new Map(); // id -> { name, billed, outstanding }
    const expenseMap = new Map(); // category -> amount

    for (const k of cases) {
      let cb = 0;
      let co = 0;

      for (const inv of k.invoices || []) {
        totalBilled += inv.total;
        cb += inv.total;

        if (inv.status === "Sent" || inv.status === "Overdue") {
          totalOutstanding += inv.total;
          co += inv.total;
        }

        if (inv.clientId) {
          const cli = contactMap.get(inv.clientId);
          const key = inv.clientId || `unknown_${inv.id}`;
          const entry =
            clients.get(key) || { name: cli?.name || "Unknown Client", billed: 0, outstanding: 0 };
          entry.billed += inv.total;
          if (inv.status === "Sent" || inv.status === "Overdue") entry.outstanding += inv.total;
          clients.set(key, entry);
        }
      }

      const expTotal = (k.expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);
      totalExpenses += expTotal;

      (k.expenses || []).forEach((e) => {
        expenseMap.set(e.category, (expenseMap.get(e.category) || 0) + (e.amount || 0));
      });

      caseRows.push({
        id: k.id,
        name: `${k.caseNumber}/${k.year}`,
        billed: cb,
        outstanding: co,
        expenses: expTotal,
      });
    }

    const clientRows = Array.from(clients.values()).sort((a, b) => b.billed - a.billed);
    const expenseRows = Array.from(expenseMap.entries()).sort((a, b) => b[1] - a[1]);

    return {
      totals: { billed: totalBilled, outstanding: totalOutstanding, expenses: totalExpenses },
      caseRows,
      clientRows,
      expenseRows,
    };
  }, [cases, contactMap]);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Finance Dashboard</h1>
      <p className="text-muted mb-8">A global overview of your firm's financial health.</p>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Billed" value={FMT(data.totals.billed)} icon={<span>💳</span>} />
        <StatCard title="Total Outstanding" value={FMT(data.totals.outstanding)} icon={<span>💵</span>} />
        <StatCard title="Total Expenses" value={FMT(data.totals.expenses)} icon={<span>📈</span>} />
      </div>

      <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-4 sm:p-6">
        {/* Tabs */}
        <div className="mb-4 flex gap-2 border-b border-border/40 pb-4">
          <Tab label="By Case" active={active === "case"} onClick={() => setActive("case")} />
          <Tab label="By Client" active={active === "client"} onClick={() => setActive("client")} />
          <Tab label="Expenses" active={active === "expense"} onClick={() => setActive("expense")} />
        </div>

        {loading ? (
          <div className="text-center p-8 text-muted">Loading financial data…</div>
        ) : active === "case" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-foreground/5">
                <tr>
                  <th className="p-3 text-sm font-semibold text-muted">Case</th>
                  <th className="p-3 text-sm font-semibold text-muted text-right">Total Billed</th>
                  <th className="p-3 text-sm font-semibold text-muted text-right">Outstanding</th>
                  <th className="p-3 text-sm font-semibold text-muted text-right">Total Expenses</th>
                </tr>
              </thead>
              <tbody>
                {data.caseRows.map((r) => (
                  <tr key={r.id} className="border-b border-border/30">
                    <td className="p-3 font-semibold">{r.name}</td>
                    <td className="p-3 text-right text-muted">{FMT(r.billed)}</td>
                    <td
                      className={`p-3 text-right font-medium ${
                        r.outstanding > 0 ? "text-amber-300" : "text-muted"
                      }`}
                    >
                      {FMT(r.outstanding)}
                    </td>
                    <td className="p-3 text-right text-muted">{FMT(r.expenses)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : active === "client" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-foreground/5">
                <tr>
                  <th className="p-3 text-sm font-semibold text-muted">Client</th>
                  <th className="p-3 text-sm font-semibold text-muted text-right">Total Billed</th>
                  <th className="p-3 text-sm font-semibold text-muted text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {data.clientRows.map((r) => (
                  <tr key={r.name} className="border-b border-border/30">
                    <td className="p-3 font-semibold">{r.name}</td>
                    <td className="p-3 text-right text-muted">{FMT(r.billed)}</td>
                    <td
                      className={`p-3 text-right font-medium ${
                        r.outstanding > 0 ? "text-amber-300" : "text-muted"
                      }`}
                    >
                      {FMT(r.outstanding)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-foreground/5">
                <tr>
                  <th className="p-3 text-sm font-semibold text-muted">Expense Category</th>
                  <th className="p-3 text-sm font-semibold text-muted text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.expenseRows.map(([cat, amt]) => (
                  <tr key={cat} className="border-b border-border/30">
                    <td className="p-3 font-semibold">{cat}</td>
                    <td className="p-3 text-right text-muted">{FMT(amt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
