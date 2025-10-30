"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

const statusBadge = {
  Active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Disposed: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Closed: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  Withdrawn: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

export default function CaseCard({ data, onEdit, onDelete }) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold truncate">
            {data.caseType}: {data.caseNumber}/{data.year}
          </div>
          <div className="text-xs text-muted">CNR: {data.cnrNumber}</div>
        </div>
        <span
          className={`px-2 py-1 text-[11px] rounded-full border whitespace-nowrap ${
            statusBadge[data.status] || "bg-foreground/10 text-foreground/80 border-border/40"
          }`}
        >
          {data.status}
        </span>
      </div>

      <div className="text-sm text-muted space-y-1">
        <div><span className="text-foreground font-medium">Court:</span> {data.court}</div>
        <div><span className="text-foreground font-medium">Filing Date:</span> {new Date(data.filingDate).toLocaleDateString()}</div>
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium">Stage:</span>
          <span className="text-xs px-2 py-0.5 rounded bg-foreground/10">{data.stage}</span>
        </div>
      </div>

      <div className="mt-2 pt-3 border-t border-border/40 flex items-center justify-end gap-2">
        <Button size="sm" onClick={() => router.push(`/cases/${data.id}`)}>Manage</Button>
        <button onClick={onEdit} className="px-2 py-1 text-sm rounded border border-border/40 hover:bg-foreground/5">Edit</button>
        <button onClick={onDelete} className="px-2 py-1 text-sm rounded border border-red-500/30 text-red-300 hover:bg-red-500/10">Delete</button>
      </div>
    </div>
  );
}
