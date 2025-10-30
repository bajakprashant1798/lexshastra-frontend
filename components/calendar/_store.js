"use client";

// Very small localStorage-backed store for demo purposes

const EVENTS_KEY = "demo_calendar_events_v1";
const GTASKS_KEY = "demo_global_tasks_v1";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ----- General Events (non-case) -----
export function getEvents() {
  return read(EVENTS_KEY, []);
}
export function addEvent(evt) {
  const list = getEvents();
  list.push({
    id: crypto.randomUUID(),
    title: evt.title,
    start: evt.start, // ISO
    end: evt.end,     // ISO
    description: evt.description || "",
    attachments: evt.attachments || [],
  });
  write(EVENTS_KEY, list);
  return list[list.length - 1];
}

// ----- Global Tasks (non-case) -----
export function getGlobalTasks() {
  return read(GTASKS_KEY, []);
}
export function addGlobalTask(task) {
  const list = getGlobalTasks();
  list.push({
    id: crypto.randomUUID(),
    title: task.title,
    dueDate: task.dueDate, // YYYY-MM-DD
    description: task.description || "",
    priority: task.priority || "Medium",
    attachments: task.attachments || [],
    status: "Pending",
  });
  write(GTASKS_KEY, list);
  return list[list.length - 1];
}
