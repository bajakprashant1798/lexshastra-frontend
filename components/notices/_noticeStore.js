// components/notices/_noticeStore.js
// In-memory demo store for notices (replace with API later)

let _notices = [
  {
    id: "n1",
    title: "Demand Notice re: Invoice 345",
    type: "Demand Notice", // Legal Notice | Demand Notice | Public Notice | Internal Memo
    status: "Sent",        // Draft | Sent | Acknowledged | Replied
    sentFrom: "Amit Sharma, Advocate",
    sentTo: "Neha Gupta",
    dateSent: "2025-09-10",
    dueDate: "2025-09-25",
    content: "Payment due within 15 days from receipt.",
    caseId: "c1",
    attachments: ["demand_notice_345.pdf"],
  },
  {
    id: "n2",
    title: "Legal Notice: Breach of Contract",
    type: "Legal Notice",
    status: "Draft",
    sentFrom: "Amit Sharma, Advocate",
    sentTo: "Mohan Enterprises",
    dateSent: "2025-10-05",
    dueDate: "",
    content: "Draft content...",
    caseId: "c2",
    attachments: [],
  },
];

export function getNotices() {
  // newest first for convenience
  return [..._notices].sort(
    (a, b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime()
  );
}

export function addNotice(payload) {
  const id = `n_${Math.random().toString(36).slice(2, 8)}`;
  const rec = { id, attachments: [], ...payload };
  _notices = [rec, ..._notices];
  return rec;
}

export function updateNotice(updated) {
  _notices = _notices.map((n) => (n.id === updated.id ? { ...n, ...updated } : n));
  return _notices.find((n) => n.id === updated.id) || null;
}

export function deleteNotice(id) {
  _notices = _notices.filter((n) => n.id !== id);
}
