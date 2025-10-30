"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getProcessedCauseListForDate,
  addHearingForCase,
  updateHearingForCase,
} from "@/lib/causeListService";
import { getDemoCases } from "@/components/cases/_demoStore";

function IconCheck() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12A10 10 0 1 1 16.07 3.4" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 1-7 0 5 5 0 0 1 0-7 5 5 0 0 1 7 0" />
      <path d="M14 11a5 5 0 0 0 7 0 5 5 0 0 0 0-7 5 5 0 0 0-7 0" />
    </svg>
  );
}

export default function CauseListPage() {
  const [date, setDate] = useState(new Date());
  const [list, setList] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await getProcessedCauseListForDate(date);
    setList(data);
    setCases(getDemoCases());
    setLoading(false);
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => list, [list]);

  async function handleAddHearing(item) {
    if (!item.linkedCaseId) return;
    const payload = {
      date: date.toISOString().split("T")[0],
      purpose: item.purpose,
      court: "From Cause List",
    };
    await addHearingForCase(item.linkedCaseId, payload);
    fetchData();
  }

  async function handleOutcome(item, hearingId, outcome) {
    const caseData = cases.find((c) => c.id === item.linkedCaseId);
    if (!caseData) return;
    const hearing = caseData.hearings.find((h) => h.id === hearingId);
    if (!hearing) return;

    let notes = `Outcome on ${hearing.date}: ${outcome}`;
    if (outcome === "Adjourned") {
      const next = prompt("Enter next hearing date (YYYY-MM-DD):");
      if (next && /^\d{4}-\d{2}-\d{2}$/.test(next)) {
        await addHearingForCase(item.linkedCaseId, {
          date: next,
          purpose: "Next Hearing",
          court: hearing.court,
        });
        notes = `Adjourned to ${next}`;
      } else if (next) {
        alert("Invalid date format.");
        return;
      }
    }

    await updateHearingForCase(item.linkedCaseId, { ...hearing, notes });
    fetchData();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Daily Cause List — {date.toLocaleDateString()}
      </h1>
      <p className="text-muted mb-6">Court-wise hearing schedule for your cases.</p>

      {loading ? (
        <p className="text-center text-muted py-8">Loading cause list...</p>
      ) : filtered.length ? (
        <div className="space-y-4">
          {filtered.map((item, i) => (
            <CauseCard
              key={`${item.caseNumber}-${i}`}
              item={item}
              onAdd={() => handleAddHearing(item)}
              onOutcome={(o) =>
                item.existingHearingId && handleOutcome(item, item.existingHearingId, o)
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted py-8">No matters found for today.</p>
      )}
    </div>
  );
}

function CauseCard({ item, onAdd, onOutcome }) {
  const statusMap = {
    Linked: { icon: <IconCheck />, color: "border-emerald-500", label: "Linked & Scheduled" },
    "Action Required": {
      icon: <IconAlert />,
      color: "border-amber-500",
      label: "Action Required",
    },
    Unlinked: { icon: <IconLink />, color: "border-border/50", label: "Unlinked" },
  };

  const s = statusMap[item.status] || statusMap.Unlinked;

  return (
    <div className={`p-4 rounded-xl border-l-4 ${s.color} bg-[var(--bg-elev)]`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-primary">
            {item.serialNumber}. {item.caseNumber}
          </p>
          <p className="text-sm">
            {item.petitioner} vs {item.respondent}
          </p>
          <p className="text-xs text-muted mt-1">Purpose: {item.purpose}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>{s.icon}</span>
          <span>{s.label}</span>
        </div>
      </div>

      <div className="border-t border-border/30 mt-3 pt-2 flex justify-between items-center text-xs">
        <div className="truncate pr-4 text-muted">
          Counsel: {item.petitionerCounsel} | {item.respondentCounsel}
        </div>
        {item.status === "Action Required" && (
          <button
            onClick={onAdd}
            className="text-xs px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
          >
            Add Hearing
          </button>
        )}
        {item.status === "Linked" && (
          <select
            defaultValue=""
            onChange={(e) => onOutcome(e.target.value)}
            className="text-xs bg-foreground/5 border border-border/50 rounded-md px-2 py-1"
          >
            <option value="" disabled>
              Log Outcome...
            </option>
            <option>Adjourned</option>
            <option>Arguments Heard</option>
            <option>Order Reserved</option>
            <option>Disposed</option>
          </select>
        )}
      </div>
    </div>
  );
}
