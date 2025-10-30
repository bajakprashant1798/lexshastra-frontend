"use client";

import { useState } from "react";

export default function ContactModal({ contact, onClose, onSave }) {
  const [form, setForm] = useState({
    name: contact?.name || "",
    category: contact?.category || "Client",
    organization: contact?.organization || "",
    phone: contact?.phone || "",
    email: contact?.email || "",
    address: contact?.address || "",
    panGst: contact?.panGst || "",
    enrollmentNumber: contact?.enrollmentNumber || "",
    barCouncil: contact?.barCouncil || "",
  });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    onSave(form);
  };

  const input = "w-full mt-1 bg-background text-foreground p-2 rounded-lg border border-border/50";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {contact ? "Edit Contact" : "Add New Contact"}
        </h2>
        <form onSubmit={submit} className="text-sm max-h-[65vh] overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <span className="text-muted">Full Name*</span>
              <input name="name" value={form.name} onChange={onChange} required className={input} />
            </label>
            <label>
              <span className="text-muted">Category</span>
              <select name="category" value={form.category} onChange={onChange} className={input}>
                <option>Client</option>
                <option>Opponent</option>
                <option>Counsel</option>
              </select>
            </label>
          </div>

          <label>
            <span className="text-muted">Organization</span>
            <input name="organization" value={form.organization} onChange={onChange} className={input} />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <span className="text-muted">Email</span>
              <input type="email" name="email" value={form.email} onChange={onChange} className={input} />
            </label>
            <label>
              <span className="text-muted">Phone</span>
              <input name="phone" value={form.phone} onChange={onChange} className={input} />
            </label>
          </div>

          <label>
            <span className="text-muted">Address</span>
            <textarea name="address" value={form.address} onChange={onChange} rows={2} className={input} />
          </label>

          {form.category === "Client" && (
            <label>
              <span className="text-muted">PAN / GST</span>
              <input name="panGst" value={form.panGst} onChange={onChange} className={input} />
            </label>
          )}

          {form.category === "Counsel" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label>
                <span className="text-muted">Enrollment Number</span>
                <input name="enrollmentNumber" value={form.enrollmentNumber} onChange={onChange} className={input} />
              </label>
              <label>
                <span className="text-muted">Bar Council</span>
                <input name="barCouncil" value={form.barCouncil} onChange={onChange} className={input} />
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-foreground/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-black rounded-lg"
            >
              {saving ? "Saving…" : "Save Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
