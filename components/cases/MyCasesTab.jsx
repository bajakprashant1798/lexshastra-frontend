"use client";

import { useEffect, useMemo, useState } from "react";
import CaseCard from "./CaseCard";
import EditCaseModal from "./modals/EditCaseModal";
import {
  getDemoCases,
  updateDemoCase,
  deleteDemoCase,
} from "./_demoStore";

export default function MyCasesTab() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);

  const [editing, setEditing] = useState(null);

  // load from demo store
  useEffect(() => {
    setRows(getDemoCases());
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.caseType,
        r.caseNumber,
        r.year,
        r.cnrNumber,
        r.court,
        r.judges,
        r.stage,
        r.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, rows]);

  const handleSaveEdit = (updated) => {
    updateDemoCase(updated);
    setRows(getDemoCases());
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this case?")) {
      deleteDemoCase(id);
      setRows(getDemoCases());
    }
  };

  return (
    <>
      {/* Search */}
      <div className="my-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Case No, CNR, Year, Court, Judge…"
          className="w-full px-4 py-2 rounded-xl bg-[var(--bg-elev)] border border-border/50 outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Grid */}
      {filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CaseCard
              key={c.id}
              data={c}
              onEdit={() => setEditing(c)}
              onDelete={() => handleDelete(c.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-8 text-center">
          <div className="text-lg font-semibold">No Cases Found</div>
          <div className="text-sm text-muted mt-1">
            {query ? "Try adjusting your search terms." : "Add your first case using the Add Case tab."}
          </div>
        </div>
      )}

      {editing && (
        <EditCaseModal
          value={editing}
          onCancel={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
