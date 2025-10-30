// app/(dashboard)/team/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { getTeamMembers, addTeamMember, updateTeamMember } from "@/lib/team";
import TeamMemberModal from "@/components/team/TeamMemberModal";
import Button from "@/components/ui/Button";

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");

  function refresh() {
    setLoading(true);
    const list = getTeamMembers();
    setTeam(list);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return team;
    return team.filter(
      (m) =>
        m.name?.toLowerCase().includes(t) ||
        m.email?.toLowerCase().includes(t) ||
        m.role?.toLowerCase().includes(t)
    );
  }, [team, q]);

  async function handleSave(payload) {
    // payload is either {id,...} (edit) or {name,email,role,phone}
    if (payload.id) {
      await updateTeamMember(payload);
    } else {
      await addTeamMember({
        name: payload.name,
        email: payload.email,
        role: payload.role,
        phone: payload.phone,
      });
    }
    setModalOpen(false);
    setEditing(null);
    refresh();
  }

  async function toggleActive(member) {
    const next = member.status === "Active" ? "Inactive" : "Active";
    if (!confirm(`Are you sure you want to set ${member.name} as ${next}?`)) return;
    await updateTeamMember({ ...member, status: next });
    refresh();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted mt-1">Manage your organization’s members and roles.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + Add Team Member
        </Button>
      </div>

      <div className="mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, or role…"
          className="w-full px-4 py-2 rounded-xl bg-[var(--bg-elev)] border border-border/50 outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {loading ? (
        <p className="text-muted">Loading team members…</p>
      ) : filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`bg-[var(--bg-elev)] p-5 rounded-2xl border border-border/50 flex flex-col justify-between ${
                m.status === "Inactive" ? "opacity-50" : ""
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{m.name}</h3>
                  <span
                    className={`px-2 py-1 text-[11px] font-semibold rounded-full whitespace-nowrap ${
                      m.status === "Active"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-slate-500/15 text-slate-300 border border-slate-500/30"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-primary">{m.role}</p>
                <div className="text-sm text-muted mt-2 space-y-1">
                  <p>{m.email}</p>
                  <p>{m.phone || "No phone number"}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-border/30 pt-3 mt-4">
                <button
                  onClick={() => toggleActive(m)}
                  className="text-xs font-semibold text-foreground/70 hover:text-foreground"
                >
                  {m.status === "Active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => {
                    setEditing(m);
                    setModalOpen(true);
                  }}
                  className="px-2 py-1 text-sm rounded border border-border/40 hover:bg-foreground/5"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted md:col-span-2 lg:col-span-3 text-center py-8">
          No team members found.
        </p>
      )}

      {modalOpen && (
        <TeamMemberModal member={editing} onClose={() => setModalOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
}
