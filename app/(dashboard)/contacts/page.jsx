"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} from "@/components/contacts/_contactStore";
import ContactModal from "@/components/contacts/ContactModal";
import Button from "@/components/ui/Button";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchData = () => {
    setLoading(true);
    const data = getContacts();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchCat = category === "All" || c.category === category;
      const s = search.toLowerCase();
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(s) ||
        (c.organization || "").toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s);
      return matchCat && matchSearch;
    });
  }, [contacts, search, category]);

  const onSave = (data) => {
    if (editing) updateContact({ ...data, id: editing.id });
    else addContact(data);
    setModalOpen(false);
    setEditing(null);
    fetchData();
  };

  const onDelete = (id) => {
    if (!confirm("Delete this contact?")) return;
    deleteContact(id);
    fetchData();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Directory</h1>
          <p className="text-muted mt-1">
            Manage all your clients, opponents, and counsels.
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
          + Add Contact
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, org, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow w-full px-4 py-2 rounded-lg bg-[var(--bg-elev)] border border-border/50 outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-48 px-4 py-2 rounded-lg bg-[var(--bg-elev)] border border-border/50 outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option>All</option>
          <option>Client</option>
          <option>Opponent</option>
          <option>Counsel</option>
        </select>
      </div>

      <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/5">
              <tr>
                <th className="p-4 font-semibold text-muted">Name</th>
                <th className="p-4 font-semibold text-muted">Category</th>
                <th className="p-4 font-semibold text-muted hidden md:table-cell">Phone</th>
                <th className="p-4 font-semibold text-muted hidden sm:table-cell">Email</th>
                <th className="p-4 font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted">
                    Loading contacts…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-border/40 hover:bg-foreground/5 transition"
                  >
                    <td className="p-4">
                      <div className="font-semibold">{c.name}</div>
                      {c.organization && (
                        <div className="text-xs text-muted">{c.organization}</div>
                      )}
                    </td>
                    <td className="p-4 text-muted">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-foreground/10">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-4 text-muted hidden md:table-cell">
                      {c.phone || "—"}
                    </td>
                    <td className="p-4 text-muted hidden sm:table-cell">
                      {c.email || "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditing(c); setModalOpen(true); }}
                          className="text-sm px-2 py-1 rounded border border-border/40 hover:bg-foreground/5"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(c.id)}
                          className="text-sm px-2 py-1 rounded border border-red-500/30 text-red-300 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ContactModal
          contact={editing}
          onClose={() => setModalOpen(false)}
          onSave={onSave}
        />
      )}
    </div>
  );
}
