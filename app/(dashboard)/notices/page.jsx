"use client";

import { useEffect, useMemo, useState } from "react";
import { getNotices, deleteNotice, updateNotice } from "@/components/notices/_noticeStore";
import AddNoticeModal from "@/components/notices/AddNoticeModal";

const BADGE = {
  Draft: "bg-foreground/10 text-foreground border-border/40",
  Sent: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Acknowledged: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Replied: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

function NoticeCard({ notice, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="rounded-xl border border-border/50 bg-[var(--bg-elev)] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold truncate flex items-center gap-2">
            {notice.title}
            {!!notice.attachments?.length && <span className="text-muted text-xs">📎</span>}
          </div>
          <div className="text-sm text-muted space-y-1 mt-2">
            <div><span className="text-foreground font-medium">Type:</span> {notice.type}</div>
            <div><span className="text-foreground font-medium">To:</span> {notice.sentTo}</div>
            <div><span className="text-foreground font-medium">From:</span> {notice.sentFrom}</div>
            <div><span className="text-foreground font-medium">Date:</span> {new Date(notice.dateSent).toLocaleDateString()}</div>
            {notice.dueDate && (
              <div><span className="text-foreground font-medium">Reply Due:</span> {new Date(notice.dueDate).toLocaleDateString()}</div>
            )}
            {!!notice.attachments?.length && (
              <div className="text-xs">
                <span className="text-foreground font-medium">Attachments:</span>
                <ul className="list-disc ml-5 mt-1">
                  {notice.attachments.map((a) => (
                    <li key={a} className="truncate">{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <select
          value={notice.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${BADGE[notice.status]}`}
        >
          {Object.keys(BADGE).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="pt-3 border-t border-border/40 flex items-center justify-end gap-2">
        <button onClick={onEdit} className="px-2 py-1 text-sm rounded border border-border/40 hover:bg-foreground/5">
          Edit / View
        </button>
        <button onClick={onDelete} className="px-2 py-1 text-sm rounded border border-rose-500/30 text-rose-300 hover:bg-rose-500/10">
          Delete
        </button>
      </div>
    </div>
  );
}

export default function NoticeManagementPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // filters
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");

  const fetchData = () => {
    setLoading(true);
    setRows(getNotices());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((n) => {
      const okStatus = status === "All" || n.status === status;
      const okType = type === "All" || n.type === type;
      const q = query.trim().toLowerCase();
      const okSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.sentTo.toLowerCase().includes(q) ||
        n.sentFrom.toLowerCase().includes(q);
      return okStatus && okType && okSearch;
    });
  }, [rows, query, status, type]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notice Management</h1>
          <p className="text-muted">Draft, send, and track your legal notices.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-lg bg-primary text-black font-semibold"
        >
          + Add Notice
        </button>
      </div>

      <div className="rounded-xl border border-border/50 bg-[var(--bg-elev)] p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, to, from…"
            className="px-3 py-2 rounded-lg bg-background border border-border/50 outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-lg bg-background border border-border/50 text-sm">
            <option>All</option>
            <option>Draft</option>
            <option>Sent</option>
            <option>Acknowledged</option>
            <option>Replied</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-lg bg-background border border-border/50 text-sm">
            <option>All</option>
            <option>Legal Notice</option>
            <option>Demand Notice</option>
            <option>Public Notice</option>
            <option>Internal Memo</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-muted text-center py-8">Loading notices…</p>
      ) : filtered.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((n) => (
            <NoticeCard
              key={n.id}
              notice={n}
              onEdit={() => {
                setEditing(n);
                setModalOpen(true);
              }}
              onDelete={() => {
                if (confirm("Delete this notice?")) {
                  deleteNotice(n.id);
                  fetchData();
                }
              }}
              onStatusChange={(newStatus) => {
                updateNotice({ ...n, status: newStatus });
                fetchData();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-[var(--bg-elev)] p-8 text-center">
          <div className="text-lg font-semibold">No notices found</div>
          <div className="text-sm text-muted mt-1">
            {rows.length ? "No notices match your filters." : "Create your first notice to get started."}
          </div>
        </div>
      )}

      {modalOpen && (
        <AddNoticeModal
          notice={editing}
          onClose={() => setModalOpen(false)}
          onSaveSuccess={() => {
            setModalOpen(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
