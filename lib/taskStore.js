// lib/taskStore.js
// LocalStorage-backed "Global Tasks" (tasks not tied to a case)

const KEY = "__global_tasks_v1";

function read() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(list) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getGlobalTasks() {
  return read();
}

export function addGlobalTask(task) {
  // task: { title, description, dueDate, priority, attachments? }
  const id = `gt_${Math.random().toString(36).slice(2, 10)}`;
  const rec = {
    id,
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate,
    priority: task.priority || "Medium",
    attachments: task.attachments || [],
    status: "Pending",
  };
  const list = read();
  list.unshift(rec);
  write(list);
  return rec;
}

export function updateGlobalTask(updated) {
  const list = read().map((t) => (t.id === updated.id ? { ...t, ...updated } : t));
  write(list);
}

export function deleteGlobalTask(id) {
  const list = read().filter((t) => t.id !== id);
  write(list);
}
