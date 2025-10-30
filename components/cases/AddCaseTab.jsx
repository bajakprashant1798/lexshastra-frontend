"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ImportCaseModal from "./modals/ImportCaseModal";

const caseTypeOptions = ["Civil", "Criminal", "Arbitration", "Tribunal", "High Court", "Supreme Court"];
const stageOptions = ["Filing", "Hearing", "Evidence", "Argument", "Judgment", "Appeal"];
const statusOptions = ["Active", "Disposed", "Closed", "Withdrawn"];

const Field = ({ label, children }) => (
  <label className="text-sm">
    <span className="text-muted block mb-1">{label}</span>
    {children}
  </label>
);

export default function AddCaseTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false); // ✅ new state

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    // Build payload (replace with real API later)
    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Simulate ok
    setTimeout(() => {
      setFeedback({ type: "success", message: "Case added successfully! Find it under My Cases." });
      e.currentTarget.reset();
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6">
      {feedback && (
        <div
          className={`mb-5 rounded-lg px-4 py-3 text-sm ${
            feedback.type === "success" ? "border border-green-400/40 bg-green-500/10 text-green-200" : "border border-red-400/40 bg-red-500/10 text-red-200"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Field label="CNR Number">
          <input name="cnrNumber" required placeholder="DLCT01-001234-2024" className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary" />
        </Field>
        <Field label="Case Number">
          <input name="caseNumber" required placeholder="123" className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary" />
        </Field>
        <Field label="Year">
          <input name="year" required type="number" defaultValue={new Date().getFullYear()} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary" />
        </Field>
        <Field label="Case Type">
          <select name="caseType" required className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary">
            {caseTypeOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Filing Date">
          <input name="filingDate" type="date" required className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary" />
        </Field>
        <Field label="Court">
          <input name="court" required placeholder="Tis Hazari District Court" className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary" />
        </Field>
        <Field label="Judge(s)">
          <input name="judges" placeholder="Hon'ble Mr. Justice A. Kumar" className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary" />
        </Field>
        <Field label="Stage">
          <select name="stage" required defaultValue="Filing" className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary">
            {stageOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" required defaultValue="Active" className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary">
            {statusOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>

        <div className="md:col-span-2 xl:col-span-3 flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Add Case"}
          </Button>
          <Button variant="outline" type="reset">
            Reset
          </Button>
          {/* ✅ New import button */}
          <Button
            variant="outline"
            type="button"
            onClick={() => setShowImportModal(true)}
          >
            Import from e-Courts
          </Button>
        </div>
      </form>

      {/* ✅ Modal mount */}
      {showImportModal && (
        <ImportCaseModal onClose={() => setShowImportModal(false)} />
      )}
    </div>
  );
}
