"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// If you already keep the demo data in a file, import from there.
// For now we read from localStorage/session stub used in MyCasesTab.
import { getDemoCases } from "@/components/cases/_demoStore"; // adjust if your demo source differs

function TabBtn({ id, label, active, onClick, icon = null }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg whitespace-nowrap border-b-2 transition-colors
      ${active ? "bg-[var(--bg-elev)] border-[var(--primary)] text-[var(--primary)]"
               : "border-transparent text-muted hover:text-foreground"}`}
    >
      {icon}
      {label}
    </button>
  );
}

export default function CaseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // --- demo data fetch (replace with API later)
  const all = getDemoCases();
  const current = useMemo(() => all.find(c => c.id === id), [all, id]);

  const [active, setActive] = useState("summary");

  if (!current) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.push("/cases")} className="text-sm font-semibold text-[var(--primary)]">&larr; Back to My Cases</button>
        <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6">
          <p className="text-muted">Case not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => router.push("/cases")} className="mb-6 text-sm font-semibold text-[var(--primary)] hover:opacity-80">
        &larr; Back to My Cases
      </button>

      {/* Header */}
      <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {current.caseType}: {current.caseNumber}/{current.year}
        </h1>
        <p className="text-muted font-medium">{current.cnrNumber}</p>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-border/50 flex gap-2 overflow-x-auto">
        <TabBtn id="summary"  label="Summary"           active={active==="summary"}  onClick={setActive}/>
        <TabBtn id="timeline" label="Timeline"          active={active==="timeline"} onClick={setActive}/>
        <TabBtn id="documents"label="Documents"         active={active==="documents"}onClick={setActive}/>
        <TabBtn id="research" label="Research"          active={active==="research"} onClick={setActive}/>
        <TabBtn id="team"     label="Team"              active={active==="team"}     onClick={setActive}/>
        <TabBtn id="billing"  label="Billing & Finance" active={active==="billing"}  onClick={setActive}/>
        <TabBtn id="tasks"    label="Tasks"             active={active==="tasks"}    onClick={setActive}/>
        <TabBtn id="hearings" label="Hearings"          active={active==="hearings"} onClick={setActive}/>
        <TabBtn id="parties"  label="Parties & Counsel" active={active==="parties"}  onClick={setActive}/>
        <TabBtn id="relations"label="Relations"         active={active==="relations"}onClick={setActive}/>
      </div>

      {/* Tab panels (stubs now; wire your old tab components here later) */}
      <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6">
        {active === "summary"   && <div className="text-sm text-muted">Summary content goes here.</div>}
        {active === "timeline"  && <div className="text-sm text-muted">Timeline content goes here.</div>}
        {active === "documents" && <div className="text-sm text-muted">Documents content goes here.</div>}
        {active === "research"  && <div className="text-sm text-muted">Research content goes here.</div>}
        {active === "team"      && <div className="text-sm text-muted">Team content goes here.</div>}
        {active === "billing"   && <div className="text-sm text-muted">Billing & Finance content goes here.</div>}
        {active === "tasks"     && <div className="text-sm text-muted">Tasks content goes here.</div>}
        {active === "hearings"  && <div className="text-sm text-muted">Hearings content goes here.</div>}
        {active === "parties"   && <div className="text-sm text-muted">Parties & Counsel content goes here.</div>}
        {active === "relations" && <div className="text-sm text-muted">Relations content goes here.</div>}
      </div>
    </div>
  );
}
