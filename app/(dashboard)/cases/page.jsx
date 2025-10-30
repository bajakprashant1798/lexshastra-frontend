// app/(dashboard)/cases/page.jsx
"use client";

import { useState } from "react";
import MyCasesTab from "@/components/cases/MyCasesTab";
import AddCaseTab from "@/components/cases/AddCaseTab";
import Button from "@/components/ui/Button";

const tabs = [
  { key: "cases", label: "My Cases" },
  { key: "add", label: "Add Case" },
];

export default function CasesPage() {
  const [active, setActive] = useState("cases");

  return (
    <>
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {active === "cases" ? "My Cases" : "Add a New Case"}
          </h1>
          <p className="text-muted">
            {active === "cases"
              ? "Here is a list of all the cases you are managing."
              : "Fill the form to create a new case record."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-border/40 p-1 bg-[var(--bg-elev)]">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${active === t.key ? "bg-primary text-black" : "text-muted hover:bg-foreground/5"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {active === "cases" ? <MyCasesTab /> : <AddCaseTab />}
    </>
  );
}