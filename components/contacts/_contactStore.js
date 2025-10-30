// components/contacts/_contactStore.js
// Local demo store for Contacts (in-memory + localStorage persistence)

const KEY = "__demo_contacts_v1";

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

// --- seed a few demo contacts on first load
function seedIfEmpty() {
  if (typeof window === "undefined") return;
  const current = read();
  if (current.length) return;
  const seed = [
    {
      id: "ct1",
      name: "Amit Sharma",
      category: "Client",
      organization: "Amit Traders Pvt Ltd",
      phone: "9876543210",
      email: "amit@traders.in",
      address: "Connaught Place, New Delhi",
      panGst: "ABCDE1234F",
    },
    {
      id: "ct2",
      name: "Ravi Patel",
      category: "Counsel",
      organization: "High Court",
      phone: "9922334455",
      email: "ravi@hcbar.in",
      address: "Civil Lines, Jaipur",
      enrollmentNumber: "RJ1234",
      barCouncil: "Rajasthan Bar Council",
    },
    {
      id: "ct3",
      name: "Neha Gupta",
      category: "Opponent",
      organization: "Gupta & Co.",
      phone: "9988776655",
      email: "neha@guptaco.in",
      address: "MG Road, Gurugram",
    },
  ];
  write(seed);
}

export function getContacts() {
  seedIfEmpty();
  return read();
}

export function addContact(data) {
  const id = `ct_${Math.random().toString(36).slice(2, 8)}`;
  const rec = { id, ...data };
  const list = read();
  list.unshift(rec);
  write(list);
  return rec;
}

export function updateContact(data) {
  const list = read().map((c) => (c.id === data.id ? { ...c, ...data } : c));
  write(list);
  return data;
}

export function deleteContact(id) {
  const list = read().filter((c) => c.id !== id);
  write(list);
}
