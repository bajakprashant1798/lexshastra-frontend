"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { addNotice, updateNotice } from "./_noticeStore";
import { getNoticeTemplates } from "./_noticeTemplateStore";
import { getDemoCases } from "@/components/cases/_demoStore";
import { getContacts } from "@/components/contacts/_contactStore";
import { analyzeNoticeText, generateNoticeDraft } from "@/lib/ai";
import { addTask } from "@/lib/taskStore";        // created earlier in your project
import { addEvent } from "@/components/calendar/_store";   // created earlier in your project

export default function AddNoticeModal({ notice, onClose, onSaveSuccess }) {
  const [direction, setDirection] = useState(
    notice?.sentFrom ? "outbound" : "inbound"
  );

  const [form, setForm] = useState({
    title: notice?.title || "",
    type: notice?.type || "Legal Notice",
    status: notice?.status || "Draft",
    sentFrom: notice?.sentFrom || "",
    sentTo: notice?.sentTo || "",
    dateSent: notice?.dateSent || new Date().toISOString().split("T")[0],
    dueDate: notice?.dueDate || "",
    content: notice?.content || "",
    caseId: notice?.caseId || "",
    attachments: notice?.attachments || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // inbound
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // outbound
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // lookups
  const [cases, setCases] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    setCases(getDemoCases());
    setContacts(getContacts());
    if (direction === "outbound") setTemplates(getNoticeTemplates());
  }, [direction]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // --- inbound processors ---
  const processFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setForm((s) => ({ ...s, title: `Notice from ${selectedFile.name.split(".")[0]}` }));
    setAnalysisError("");
    setIsAnalyzing(true);

    try {
      let text = "";
      const lower = selectedFile.name.toLowerCase();
      if (lower.endsWith(".txt")) {
        text = await selectedFile.text();
      } else if (lower.endsWith(".docx")) {
        // simple fallback: show filename (for demo).
        // You can integrate mammoth.js in Next if you want real parsing in browser.
        text = `(Demo) Uploaded DOCX: ${selectedFile.name}`;
      } else if (lower.endsWith(".pdf")) {
        text = `(Demo) Uploaded PDF: ${selectedFile.name}`;
      } else {
        throw new Error("Unsupported file type (use .txt, .docx, .pdf)");
      }

      const analysis = await analyzeNoticeText(text);
      setForm((prev) => ({
        ...prev,
        sentFrom: analysis.sender,
        sentTo: analysis.recipient,
        dateSent: analysis.noticeDate || prev.dateSent,
        dueDate: analysis.replyByDate || "",
        content: `**AI Summary:**\n${analysis.summary}\n\n**Full Extracted Text (demo):**\n${text}`,
      }));
    } catch (err) {
      setAnalysisError(err.message || "Failed to analyze");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // --- outbound draft ---
  const handleGenerate = async () => {
    if (!templateId || !keyPoints) {
      alert("Select a template and enter key points.");
      return;
    }
    setIsGenerating(true);
    try {
      const tpl = templates.find((t) => t.id === templateId);
      const sender = contacts.find((c) => c.id === form.sentFrom);
      const recipient = contacts.find((c) => c.id === form.sentTo);
      const caseInfo = cases.find((c) => c.id === form.caseId);
      const draft = await generateNoticeDraft(tpl, keyPoints, {
        sender,
        recipient,
        caseInfo,
      });
      setForm((s) => ({ ...s, content: draft }));
    } catch (e) {
      alert(e.message || "Failed to generate draft");
    } finally {
      setIsGenerating(false);
    }
  };

  const addFiles = (e) => {
    if (!e.target.files) return;
    const names = Array.from(e.target.files).map((f) => f.name);
    setForm((s) => ({
      ...s,
      attachments: [...new Set([...(s.attachments || []), ...names])],
    }));
  };
  const removeAttachment = (name) =>
    setForm((s) => ({ ...s, attachments: (s.attachments || []).filter((n) => n !== name) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (notice) {
        await updateNotice({ ...form, id: notice.id });
      } else {
        const created = await addNotice(form);

        // Auto-create task/event for inbound deadlines (demo)
        if (direction === "inbound" && form.dueDate) {
          const due = new Date(`${form.dueDate}T00:00:00`);
          if (!isNaN(due.getTime())) {
            const minus2 = new Date(due.getTime() - 2 * 24 * 60 * 60 * 1000);
            // global task (demo)
            addTask({
              id: `t_${Math.random().toString(36).slice(2, 8)}`,
              title: `Draft Reply: ${form.title}`,
              dueDate: minus2.toISOString().split("T")[0],
              priority: "High",
              status: "Pending",
              description: `Reply to notice from ${form.sentFrom}. Deadline ${due.toLocaleDateString()}.`,
            });
            // calendar event (demo)
            addEvent({
              id: `e_${Math.random().toString(36).slice(2, 8)}`,
              title: `Reply Deadline: ${form.title}`,
              start: new Date(due.setHours(10, 0, 0, 0)).toISOString(),
              end: new Date(due.setHours(11, 0, 0, 0)).toISOString(),
              description: `Final deadline to reply to notice from ${form.sentFrom}.`,
            });
          }
        }
      }
      onSaveSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save notice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const input = "w-full mt-1 bg-[var(--bg-elev)] border border-border/50 p-2 rounded-lg";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{notice ? "Edit Notice" : "Add New Notice"}</h2>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-lg border border-border/40 hover:bg-foreground/5">
            Close
          </button>
        </div>

        {!notice && (
          <div className="mb-4 flex items-center gap-2 bg-foreground/5 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setDirection("inbound")}
              className={`w-full p-2 rounded-md text-sm font-semibold ${direction === "inbound" ? "bg-primary text-black" : ""}`}
            >
              Inbound (Received)
            </button>
            <button
              type="button"
              onClick={() => setDirection("outbound")}
              className={`w-full p-2 rounded-md text-sm font-semibold ${direction === "outbound" ? "bg-primary text-black" : ""}`}
            >
              Outbound (Send)
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {direction === "inbound" ? (
            <>
              <div
                className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                onClick={() => document.getElementById("notice-upload")?.click()}
              >
                <input
                  id="notice-upload"
                  type="file"
                  accept=".txt,.docx,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files && processFile(e.target.files[0])}
                />
                {isAnalyzing ? (
                  <p className="font-semibold">Analyzing document…</p>
                ) : file ? (
                  <p className="font-semibold">File: {file.name}</p>
                ) : (
                  <p className="font-semibold">Click to upload or drag &amp; drop notice</p>
                )}
                <p className="text-xs text-muted mt-1">.pdf, .docx, .txt supported (demo extract)</p>
              </div>
              {analysisError && <p className="text-rose-300 text-sm">{analysisError}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="text-muted block mb-1">From*</span>
                  <input name="sentFrom" value={form.sentFrom} onChange={onChange} required className={input} />
                </label>
                <label className="text-sm">
                  <span className="text-muted block mb-1">To*</span>
                  <input name="sentTo" value={form.sentTo} onChange={onChange} required className={input} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="text-muted block mb-1">Notice Date</span>
                  <input type="date" name="dateSent" value={form.dateSent} onChange={onChange} className={input} />
                </label>
                <label className="text-sm">
                  <span className="text-muted block mb-1">Reply Due Date</span>
                  <input type="date" name="dueDate" value={form.dueDate} onChange={onChange} className={input} />
                </label>
              </div>

              <label className="text-sm">
                <span className="text-muted block mb-1">Title*</span>
                <input name="title" value={form.title} onChange={onChange} required className={input} />
              </label>

              <label className="text-sm">
                <span className="text-muted block mb-1">Content / Summary</span>
                <textarea name="content" value={form.content} onChange={onChange} rows={8} className={`${input} font-mono`} />
              </label>
            </>
          ) : (
            // outbound
            <>
              <label className="text-sm">
                <span className="text-muted block mb-1">Title*</span>
                <input name="title" value={form.title} onChange={onChange} required className={input} />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                  <span className="text-muted block mb-1">From (Sender)*</span>
                  <select name="sentFrom" value={form.sentFrom} onChange={onChange} required className={input}>
                    <option value="">-- Select Sender --</option>
                    {contacts
                      .filter((c) => c.category === "Counsel")
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="text-muted block mb-1">To (Recipient)*</span>
                  <select name="sentTo" value={form.sentTo} onChange={onChange} required className={input}>
                    <option value="">-- Select Recipient --</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="text-sm">
                <span className="text-muted block mb-1">Link to Case (Optional)</span>
                <select name="caseId" value={form.caseId} onChange={onChange} className={input}>
                  <option value="">None</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber}/{c.year}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="text-muted block mb-1">Template</span>
                <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className={input}>
                  <option value="">-- Select a Template --</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="text-muted block mb-1">Key Points / Instructions</span>
                <textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  rows={4}
                  placeholder="Enter bullet points for the draft…"
                  className={input}
                />
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !templateId || !keyPoints}
                  className="mt-2 px-3 py-1.5 text-sm font-semibold rounded-md bg-primary/20 text-primary disabled:opacity-50"
                >
                  {isGenerating ? "Generating…" : "Generate Draft (Demo)"}
                </button>
              </label>

              <label className="text-sm">
                <span className="text-muted block mb-1">Final Content</span>
                <textarea name="content" value={form.content} onChange={onChange} rows={10} className={`${input} font-mono`} />
              </label>
            </>
          )}

          {/* common attachments */}
          <div>
            <div className="text-sm text-muted mb-1">Attachments</div>
            <div className="flex items-center gap-2">
              <label htmlFor="notice-attachments" className="cursor-pointer text-sm px-3 py-1.5 border border-border/60 rounded-lg">
                Add Files…
              </label>
              <input id="notice-attachments" type="file" multiple className="hidden" onChange={addFiles} />
            </div>
            {!!form.attachments?.length && (
              <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                {form.attachments.map((name) => (
                  <div key={name} className="text-xs bg-foreground/5 p-1.5 rounded flex justify-between items-center">
                    <span className="truncate pr-2">{name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(name)}
                      className="text-rose-300 font-bold flex-shrink-0"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border/60">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isAnalyzing}
              className="px-4 py-2 rounded-lg bg-primary text-black font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : "Save Notice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
