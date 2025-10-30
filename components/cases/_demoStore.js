// components/cases/_demoStore.js
// Single source of truth for demo data while backend isn't ready.

const today = new Date();
const plus = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

let _cases = [
  {
    id: "c1",
    caseType: "Civil",
    caseNumber: "123",
    year: "2024",
    cnrNumber: "DLCT01-001234-2024",
    court: "Tis Hazari District Court, Delhi",
    filingDate: "2024-01-15",
    judges: "Hon'ble Mr. Justice Sharma",
    stage: "Hearing",
    status: "Active",

    // --- finance demo
    invoices: [
      { id: "inv_c1_1", clientId: "ct1", total: 35000, status: "Sent" },     // Sent | Overdue | Paid | Draft
      { id: "inv_c1_2", clientId: "ct1", total: 18000, status: "Paid" },
    ],
    expenses: [
      { id: "exp_c1_1", category: "Filing Fees", amount: 2500 },
      { id: "exp_c1_2", category: "Travel", amount: 1600 },
      { id: "exp_c1_3", category: "Misc", amount: 900 },
    ],

    hearings: [
      {
        id: "h1",
        date: plus(1),        // tomorrow
        time: "14:00",
        court: "Courtroom 3",
        purpose: "Arguments",
        notes: "Bring precedent bundle",
        reminder: "1 day before",
        attachments: [],
      },
      {
        id: "h2",
        date: plus(14),
        time: "11:30",
        court: "Courtroom 2",
        purpose: "Evidence",
        notes: "",
        reminder: "2 days before",
        attachments: [],
      },
    ],
    tasks: [
      {
        id: "t1",
        title: "Draft Written Statement",
        dueDate: plus(2),
        priority: "High",
        description: "First draft for review",
        attachments: [],
        status: "Pending",
      },
      {
        id: "t2",
        title: "Serve notice to respondent",
        dueDate: plus(5),
        priority: "Medium",
        description: "",
        attachments: [],
        status: "In Progress",
      },
    ],
    documents: [],
    counsels: [],
    parties: [],
    relations: [],
  },
  {
    id: "c2",
    caseType: "Criminal",
    caseNumber: "5678",
    year: "2023",
    cnrNumber: "RJJP01-005678-2023",
    court: "Jaipur District Court",
    filingDate: "2023-11-20",
    judges: "—",
    stage: "Evidence",
    status: "Active",

    // --- finance demo
    invoices: [
      { id: "inv_c2_1", clientId: "ct3", total: 22000, status: "Overdue" },
      { id: "inv_c2_2", clientId: "ct3", total: 12000, status: "Draft" },
    ],
    expenses: [
      { id: "exp_c2_1", category: "Research", amount: 1400 },
      { id: "exp_c2_2", category: "Travel", amount: 1200 },
    ],

    hearings: [
      {
        id: "h3",
        date: plus(3),
        time: "10:00",
        court: "Courtroom 1",
        purpose: "Bail Application",
        notes: "Affidavit required",
        reminder: "1 day before",
        attachments: [],
      },
    ],
    tasks: [
      {
        id: "t3",
        title: "Collect medical records",
        dueDate: plus(1),
        priority: "Low",
        description: "",
        attachments: [],
        status: "Pending",
      },
    ],
    documents: [],
    counsels: [],
    parties: [],
    relations: [],
  },
];

export function getDemoCases() {
  return [..._cases];
}
export function getDemoCaseById(id) {
  return _cases.find((c) => c.id === id) || null;
}
export function updateDemoCase(updated) {
  _cases = _cases.map((c) => (c.id === updated.id ? { ...c, ...updated } : c));
  return getDemoCaseById(updated.id);
}
export function deleteDemoCase(id) {
  _cases = _cases.filter((c) => c.id !== id);
}
export function addDemoCase(payload) {
  const id = `c${Math.random().toString(36).slice(2, 8)}`;
  const rec = { id, hearings: [], tasks: [], documents: [], counsels: [], parties: [], relations: [], invoices: [], expenses: [], ...payload };
  _cases.unshift(rec);
  return rec;
}



// ---- CASE TASK HELPERS (add at bottom of components/cases/_demoStore.js) ----
export function addTaskToCase(caseId, partial) {
  const t = {
    id: `ct_${Math.random().toString(36).slice(2, 10)}`,
    caseId,
    title: partial.title,
    description: partial.description || "",
    dueDate: partial.dueDate,
    priority: partial.priority || "Medium",
    attachments: partial.attachments || [],
    assigneeId: partial.assigneeId || "",
    hearingId: partial.hearingId || "",
    status: "Pending",
  };
  const idx = _cases.findIndex((c) => c.id === caseId);
  if (idx !== -1) {
    _cases[idx].tasks = _cases[idx].tasks || [];
    _cases[idx].tasks.unshift(t);
  }
  return t;
}

export function updateTaskInCase(caseId, updated) {
  const c = _cases.find((x) => x.id === caseId);
  if (!c) return;
  c.tasks = (c.tasks || []).map((t) => (t.id === updated.id ? { ...t, ...updated } : t));
}

export function deleteTaskFromCase(caseId, taskId) {
  const c = _cases.find((x) => x.id === caseId);
  if (!c) return;
  c.tasks = (c.tasks || []).filter((t) => t.id !== taskId);
}

export function addDemoHearing(caseId, hearingData) {
  const caseIndex = _cases.findIndex((c) => c.id === caseId);
  if (caseIndex === -1) return null;

  const hearing = {
    id: `h_${Math.random().toString(36).slice(2, 8)}`,
    ...hearingData,
  };
  _cases[caseIndex].hearings = _cases[caseIndex].hearings || [];
  _cases[caseIndex].hearings.push(hearing);
  return hearing;
}

export function updateDemoHearing(caseId, hearingData) {
  const c = _cases.find((c) => c.id === caseId);
  if (!c || !c.hearings) return null;
  c.hearings = c.hearings.map((h) => (h.id === hearingData.id ? { ...h, ...hearingData } : h));
  return hearingData;
}
