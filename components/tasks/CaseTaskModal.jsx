"use client";

import { useEffect, useMemo, useState } from "react";
import { getTeamMembers } from "@/lib/team";
// import { getCurrentUser } from "@/lib/auth";

export default function CaseTaskModal({ task, caseData, allCases, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || new Date().toISOString().slice(0, 10));
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [status, setStatus] = useState(task?.status || "Pending");
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [hearingId, setHearingId] = useState(task?.hearingId || "");
  const [selectedCaseId, setSelectedCaseId] = useState(task?.caseId || caseData?.id || "");
  const [attachments, setAttachments] = useState(task?.attachments || []);

  const activeCase = useMemo(() => {
    const pool = caseData ? [caseData] : allCases || [];
    return pool.find((c) => c.id === selectedCaseId);
  }, [selectedCaseId, caseData, allCases]);

  const [caseTeamMembers, setCaseTeamMembers] = useState([]);
  useEffect(() => {
    if (activeCase) {
      // basic mock: everyone is available, filter to "Active" if present
      const members = getTeamMembers().filter((m) => m.status === "Active");
      setCaseTeamMembers(members);
    } else {
      setCaseTeamMembers([]);
    }
  }, [activeCase]);

  const currentUser = getCurrentUser();
  const isAssignedToOther =
    task && task.assigneeId && caseTeamMembers.find((m) => m.id === task.assigneeId && m.email !== currentUser?.email);

  const onFiles = (e) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setAttachments((prev) => [...new Set([...prev, ...names])]);
    }
  };
  const removeAttachment = (name) => setAttachments((prev) => prev.filter((n) => n !== name));

  const submit = async (e) => {
    e.preventDefault();
    const finalCaseId = selectedCaseId || task?.caseId || "";
    if (!finalCaseId) {
      alert("Please select a case for this task.");
      return;
    }
    const payload = {
      title,
      description,
      dueDate,
      priority,
      assigneeId: assigneeId || undefined,
      hearingId: hearingId || undefined,
      attachments,
    };
    await onSave(finalCaseId, payload, status);
  };

  const input = "w-full mt-1 bg-background text-foreground p-2 rounded-lg border border-border/50";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{task ? "Edit Task" : "Add Task"}</h2>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-lg border border-border/40 hover:bg-foreground/5">
            Close
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 text-sm max-h-[65vh] overflow-y-auto pr-1">
          {!caseData && allCases && (
            <label className="block">
              <span className="text-muted">Case*</span>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                required
                className={input}
              >
                <option value="">-- Select a Case --</option>
                {allCases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber}/{c.year}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            <span className="text-muted">Title*</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className={input} />
          </label>

          <label className="block">
            <span className="text-muted">Description</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={input} />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-muted">Due Date*</span>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className={input} />
            </label>
            <label className="block">
              <span className="text-muted">Priority</span>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={input}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-muted">Assign To</span>
            <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className={input} disabled={!activeCase}>
              <option value="">Unassigned</option>
              {caseTeamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {!activeCase && !caseData && (
              <div className="text-xs text-muted mt-1">Select a case to see available team members.</div>
            )}
          </label>

          <label className="block">
            <span className="text-muted">Link to Hearing (optional)</span>
            <select
              value={hearingId}
              onChange={(e) => setHearingId(e.target.value)}
              className={input}
              disabled={!activeCase || !(activeCase.hearings || []).length}
            >
              <option value="">None</option>
              {(activeCase?.hearings || []).map((h) => (
                <option key={h.id} value={h.id}>
                  {h.date} – {h.purpose}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-muted block mb-1">Attachments</span>
            <div className="flex items-center gap-2">
              <label
                htmlFor="task-attachments"
                className="cursor-pointer text-sm px-3 py-1.5 border border-border rounded-lg hover:bg-foreground/5"
              >
                Add Files…
              </label>
              <input id="task-attachments" type="file" multiple onChange={onFiles} className="hidden" />
            </div>
            {!!attachments.length && (
              <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                {attachments.map((n) => (
                  <div key={n} className="text-xs bg-foreground/5 p-1.5 rounded flex justify-between">
                    <span className="truncate pr-2">{n}</span>
                    <button type="button" onClick={() => removeAttachment(n)} className="text-red-400 font-bold">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-muted">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </label>
            <div className="flex items-end justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg hover:bg-foreground/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!!isAssignedToOther}
                className="px-4 py-2 bg-primary text-black rounded-lg"
              >
                Save Task
              </button>
            </div>
          </div>

          {isAssignedToOther && (
            <div className="text-xs text-amber-300">This task is assigned to another member. Read-only.</div>
          )}
        </form>
      </div>
    </div>
  );
}
