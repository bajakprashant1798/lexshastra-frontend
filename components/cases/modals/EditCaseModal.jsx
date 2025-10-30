"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function EditCaseModal({ value, onCancel, onSave }) {
  const [form, setForm] = useState(value);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const Field = ({ label, children }) => (
    <label className="text-sm">
      <span className="text-muted block mb-1">{label}</span>
      {children}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Case</h2>
          <button onClick={onCancel} className="text-sm px-3 py-1 rounded-lg border border-border/40 hover:bg-foreground/5">Close</button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <Field label="CNR Number">
            <input name="cnrNumber" value={form.cnrNumber} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none" />
          </Field>
          <Field label="Case Number">
            <input name="caseNumber" value={form.caseNumber} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none" />
          </Field>
          <Field label="Year">
            <input name="year" value={form.year} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none" />
          </Field>
          <Field label="Case Type">
            <input name="caseType" value={form.caseType} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none" />
          </Field>
          <Field label="Filing Date">
            <input type="date" name="filingDate" value={form.filingDate} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none" />
          </Field>
          <Field label="Court">
            <input name="court" value={form.court} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none" />
          </Field>
          <Field label="Judge(s)">
            <input name="judges" value={form.judges} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none" />
          </Field>
          <Field label="Stage">
            <input name="stage" value={form.stage} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none" />
          </Field>
          <Field label="Status">
            <input name="status" value={form.status} onChange={onChange} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none" />
          </Field>

          <div className="md:col-span-2 xl:col-span-3 mt-2 flex gap-3 justify-end">
            <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
