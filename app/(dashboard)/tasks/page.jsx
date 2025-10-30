"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDemoCases,
  updateTaskInCase,
  deleteTaskFromCase,
  addTaskToCase,
} from "@/components/cases/_demoStore";
import {
  getGlobalTasks,
  updateGlobalTask,
  deleteGlobalTask,
  addGlobalTask,
} from "@/lib/taskStore";
import CaseTaskModal from "@/components/tasks/CaseTaskModal";
import Button from "@/components/ui/Button";

// Small card for each task (includes case/global info)
function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  const priorityBadge = {
    High: "bg-red-500/15 text-red-300 border-red-500/30",
    Medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    Low: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  };
  const leftBorder =
    task.status === "Completed"
      ? "border-green-500 opacity-60"
      : task.status === "In Progress"
      ? "border-blue-500"
      : "border-yellow-500";

  return (
    <div className={`rounded-xl bg-[var(--bg-elev)] border border-border/50 p-4 ${leftBorder} border-l-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`font-semibold ${task.status === "Completed" ? "line-through text-muted" : ""}`}>
            {task.title}
          </div>
          <div className="text-sm text-muted">
            {task.caseInfo ? `Case: ${task.caseInfo} | ` : "Global Task | "}
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
          {task.description && (
            <div className="text-sm text-muted mt-2 whitespace-pre-wrap">{task.description}</div>
          )}
          <div className="mt-2 text-xs inline-flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full border ${priorityBadge[task.priority] || ""}`}>
              {task.priority}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
            className="bg-background border border-border/50 rounded px-2 py-1 text-sm"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(task)}
              className="px-2 py-1 text-sm rounded border border-border/40 hover:bg-foreground/5"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task)}
              className="px-2 py-1 text-sm rounded border border-red-500/30 text-red-300 hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [all, setAll] = useState([]); // merged (case + global) with caseInfo
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [prio, setPrio] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");

  // Modal
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    const cs = getDemoCases();
    setCases(cs);

    const caseTasks = cs.flatMap((c) =>
      (c.tasks || []).map((t) => ({
        ...t,
        caseInfo: `${c.caseNumber}/${c.year}`,
      }))
    );
    const global = getGlobalTasks(); // no caseInfo
    setAll([...caseTasks, ...global]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const list = useMemo(() => {
    let out = all.filter((t) => {
      const okStatus = status === "All" || t.status === status;
      const okPrio = prio === "All" || t.priority === prio;
      const query = q.trim().toLowerCase();
      const okQ =
        !query ||
        t.title.toLowerCase().includes(query) ||
        (t.description || "").toLowerCase().includes(query) ||
        (t.caseInfo || "").toLowerCase().includes(query);
      return okStatus && okPrio && okQ;
    });

    if (sortBy === "priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      out.sort((a, b) => (order[a.priority] || 9) - (order[b.priority] || 9));
    } else {
      out.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    return out;
  }, [all, q, status, prio, sortBy]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const onDelete = (task) => {
    if (!confirm("Delete this task?")) return;
    if (task.caseId) {
      deleteTaskFromCase(task.caseId, task.id);
    } else {
      deleteGlobalTask(task.id);
    }
    fetchData();
  };

  const onStatusChange = (task, newStatus) => {
    if (task.caseId) {
      updateTaskInCase(task.caseId, { ...task, status: newStatus });
    } else {
      updateGlobalTask({ ...task, status: newStatus });
    }
    fetchData();
  };

  const onSave = async (caseId, taskData, newStatus) => {
    if (editing) {
      // update
      if (editing.caseId) {
        updateTaskInCase(editing.caseId, { ...editing, ...taskData, status: newStatus });
      } else {
        updateGlobalTask({ ...editing, ...taskData, status: newStatus });
      }
    } else {
      // add (case task)
      if (caseId) {
        addTaskToCase(caseId, taskData);
      } else {
        // fallback to global if no case selected (not used by our modal UI though)
        addGlobalTask(taskData);
      }
    }
    setModalOpen(false);
    setEditing(null);
    fetchData();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Task List</h1>
          <p className="text-muted">View and manage all tasks across your cases.</p>
        </div>
        <Button onClick={openAdd}>+ Add New Task</Button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tasks…"
            className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 outline-none"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50">
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select value={prio} onChange={(e) => setPrio(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50">
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-border/50">
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-muted py-8">Loading tasks…</div>
        ) : list.length ? (
          list.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onEdit={openEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-8 text-center">
            <div className="text-lg font-semibold">No tasks found</div>
            <div className="text-sm text-muted mt-1">
              {all.length ? "No tasks match your filters." : "Create your first task with the button above."}
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <CaseTaskModal
          task={editing}
          allCases={cases}
          onClose={() => setModalOpen(false)}
          onSave={onSave}
        />
      )}
    </div>
  );
}
