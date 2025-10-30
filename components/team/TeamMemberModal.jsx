"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function TeamMemberModal({ member, onClose, onSave }) {
  const [form, setForm] = useState({
    name: member?.name || "",
    email: member?.email || "",
    role: member?.role || "Associate",
    phone: member?.phone || "",
    status: member?.status || "Active",
    id: member?.id, // present only when editing
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm((s) => ({
      ...s,
      name: member?.name || "",
      email: member?.email || "",
      role: member?.role || "Associate",
      phone: member?.phone || "",
      status: member?.status || "Active",
      id: member?.id,
    }));
  }, [member]);

  const input =
    "w-full mt-1 bg-background text-foreground p-2 rounded-lg border border-border/50 outline-none focus:ring-2 focus:ring-primary text-sm";

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{member ? "Edit Team Member" : "Add Team Member"}</h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-lg border border-border/40 hover:bg-foreground/5"
          >
            Close
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 text-sm">
          <div>
            <label className="text-sm">
              <span className="text-muted block mb-1">Full Name*</span>
              <input className={input} name="name" value={form.name} onChange={onChange} required />
            </label>
          </div>
          <div>
            <label className="text-sm">
              <span className="text-muted block mb-1">Email*</span>
              <input type="email" className={input} name="email" value={form.email} onChange={onChange} required />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm">
              <span className="text-muted block mb-1">Role</span>
              <select className={input} name="role" value={form.role} onChange={onChange}>
                <option>Admin</option>
                <option>Associate</option>
                <option>Intern</option>
                <option>Of Counsel</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="text-muted block mb-1">Phone</span>
              <input className={input} name="phone" value={form.phone} onChange={onChange} />
            </label>
          </div>

          {member && (
            <label className="text-sm">
              <span className="text-muted block mb-1">Status</span>
              <select className={input} name="status" value={form.status} onChange={onChange}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
