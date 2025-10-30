"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// demo cases (you already have this)
import { getDemoCases } from "@/components/cases/_demoStore";

// local demo stores
import { getEvents, addEvent, getGlobalTasks, addGlobalTask } from "@/components/calendar/_store";
import { parseQuickEventText } from "@/components/calendar/parseQuick";

// Simple icon stubs (replace with your actual icons if you like)
const PlusIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...props}><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>
);
const PaperclipIcon = (props) => (
  <svg viewBox="0 0 24 24" width="14" height="14" {...props}><path fill="currentColor" d="M16.5 6.5l-7.8 7.8a3 3 0 104.2 4.2l6.4-6.4a5 5 0 10-7.1-7.1l-6.4 6.4"/></svg>
);
const SparklesIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}><path fill="currentColor" d="M9 12l-2 7-2-7-7-2 7-2 2-7 2 7 7 2-7 2zM20 7l-1 3-3 1 3 1 1 3 1-3 3-1-3-1-1-3z"/></svg>
);

// ---------- Types (JS) ----------
/*
CalendarItem {
  id, caseId?, title, date, time?, type('Hearing'|'Task'|'General'),
  colorClass, caseInfo, attachments?, item
}
*/

// ---------- Page ----------
export default function CalendarPage() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [cases, setCases] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("month"); // 'day'|'week'|'month'|'agenda'
  const [filter, setFilter] = useState("");
  const [dayDetailModal, setDayDetailModal] = useState(null); // { date: Date, items: CalendarItem[] } | null
  const [eventModal, setEventModal] = useState(null); // { type, caseId?, title?, date?, time?, description? } | null

  const fetchData = useCallback(() => {
    setIsLoading(true);
    // demo cases
    const loadedCases = getDemoCases();
    setCases(loadedCases);

    // hearings and case tasks from demo cases
    const hearings = loadedCases.flatMap((c) =>
      (c.hearings || []).map((h) => ({
        id: h.id || crypto.randomUUID(),
        caseId: c.id,
        title: h.purpose || "Hearing",
        date: h.date, // YYYY-MM-DD
        time: h.time, // HH:MM
        type: "Hearing",
        colorClass: "bg-red-500/80 text-white",
        caseInfo: `${c.caseNumber}/${c.year}`,
        attachments: h.attachments || [],
        item: h,
      }))
    );

    const caseTasks = loadedCases.flatMap((c) =>
      (c.tasks || [])
        .filter((t) => t.status !== "Completed")
        .map((t) => {
          let colorClass = "bg-violet-500/15 text-violet-300";
          if (t.priority === "High") colorClass = "bg-pink-500/15 text-pink-300";
          else if (t.priority === "Medium") colorClass = "bg-amber-500/15 text-amber-300";
          return {
            id: t.id || crypto.randomUUID(),
            caseId: c.id,
            title: t.title,
            date: t.dueDate,
            type: "Task",
            colorClass,
            caseInfo: `${c.caseNumber}/${c.year}`,
            attachments: t.attachments || [],
            item: t,
          };
        })
    );

    // global tasks + general events from our demo stores
    const globalTasks = getGlobalTasks()
      .filter((t) => t.status !== "Completed")
      .map((t) => {
        let colorClass = "bg-violet-500/15 text-violet-300";
        if (t.priority === "High") colorClass = "bg-pink-500/15 text-pink-300";
        else if (t.priority === "Medium") colorClass = "bg-amber-500/15 text-amber-300";
        return {
          id: t.id,
          title: t.title,
          date: t.dueDate,
          type: "Task",
          colorClass,
          caseInfo: "Global Task",
          attachments: t.attachments || [],
          item: t,
        };
      });

    const generalEvents = getEvents().map((e) => {
      const start = new Date(e.start);
      return {
        id: e.id,
        title: e.title,
        date: start.toISOString().split("T")[0],
        time: start.toTimeString().substring(0, 5),
        type: "General",
        colorClass: "bg-blue-500/15 text-blue-300",
        caseInfo: "General",
        attachments: e.attachments || [],
        item: e,
      };
    });

    setItems([...hearings, ...caseTasks, ...globalTasks, ...generalEvents]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    if (!filter) return items;
    const q = filter.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.caseInfo.toLowerCase().includes(q)
    );
  }, [items, filter]);

  const handleNavigation = (dir) => {
    if (dir === "today") {
      setCurrentDate(new Date());
      return;
    }
    const inc = dir === "prev" ? -1 : 1;
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "month") d.setMonth(prev.getMonth() + inc);
      if (viewMode === "week") d.setDate(prev.getDate() + 7 * inc);
      if (viewMode === "day" || viewMode === "agenda") d.setDate(prev.getDate() + inc);
      return d;
    });
  };

  const currentTitle = useMemo(() => {
    switch (viewMode) {
      case "month":
        return currentDate.toLocaleString("default", { month: "long", year: "numeric" });
      case "week": {
        const start = new Date(currentDate);
        start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1));
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `${start.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`;
      }
      case "day":
        return currentDate.toLocaleDateString("default", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      case "agenda":
        return "Upcoming Agenda";
      default:
        return "";
    }
  }, [currentDate, viewMode]);

  const goToCase = (caseId) => router.push(`/cases/${caseId}`);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Master Calendar</h1>
        <button
          onClick={() => setEventModal({ type: "General" })}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-md bg-primary text-black hover:opacity-90"
        >
          <PlusIcon /> Add Event
        </button>
      </div>

      <QuickAdd
        cases={cases}
        onEventParsed={(data) => setEventModal(data)}
      />

      <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-4 mt-4 flex flex-col flex-grow min-h-0">
        <Header
          title={currentTitle}
          onNavigate={handleNavigation}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filter={filter}
          setFilter={setFilter}
        />

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
          </div>
        ) : (
          <div className="flex-grow min-h-0 overflow-y-auto">
            {viewMode === "month" && (
              <MonthView
                currentDate={currentDate}
                items={filteredItems}
                setModalData={setDayDetailModal}
              />
            )}
            {viewMode === "week" && (
              <WeekView currentDate={currentDate} items={filteredItems} onNavigateToCase={goToCase} />
            )}
            {viewMode === "day" && (
              <DayView currentDate={currentDate} items={filteredItems} onNavigateToCase={goToCase} />
            )}
            {viewMode === "agenda" && (
              <AgendaView items={filteredItems} onNavigateToCase={goToCase} />
            )}
          </div>
        )}
      </div>

      {dayDetailModal && (
        <DayDetailModal
          modalData={dayDetailModal}
          onClose={() => setDayDetailModal(null)}
          onNavigateToCase={goToCase}
        />
      )}

      {eventModal && (
        <QuickEventModal
          key={JSON.stringify(eventModal)}
          cases={cases}
          initialData={eventModal}
          onClose={() => setEventModal(null)}
          onSaveSuccess={() => { setEventModal(null); fetchData(); }}
        />
      )}
    </div>
  );
}

// ---------- Quick Add ----------
function QuickAdd({ cases, onEventParsed }) {
  const [text, setText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState("");

  const handleParse = () => {
    if (!text.trim()) return;
    setIsParsing(true);
    setError("");
    try {
      const result = parseQuickEventText(text);
      onEventParsed({
        type: result.eventType,
        caseId: undefined, // (demo) leave blank; picker in modal
        title: result.title,
        date: result.date,
        time: result.time || undefined,
        description: result.description || "",
      });
      setText("");
    } catch (e) {
      setError("Could not parse. Try again.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-[var(--bg-elev)] p-3">
      <div className="flex items-center gap-2">
        <SparklesIcon className="text-[var(--primary)]" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleParse()}
          placeholder="Quick Add: e.g., 'Hearing tomorrow at 2pm for arguments'"
          className="w-full bg-transparent outline-none"
          disabled={isParsing}
        />
        <button
          onClick={handleParse}
          disabled={isParsing || !text}
          className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-[var(--primary)]/20 text-[var(--primary)] disabled:opacity-50"
        >
          {isParsing ? "Parsing…" : "Add"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
    </div>
  );
}

// ---------- Header ----------
function Header({ title, onNavigate, viewMode, setViewMode, filter, setFilter }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4 px-2">
      <div className="flex items-center gap-2">
        <button onClick={() => onNavigate("prev")} className="p-2 rounded-full hover:bg-foreground/5">
          ‹
        </button>
        <h2 className="text-lg font-semibold text-[var(--primary)] w-48 sm:w-64 text-center">
          {title}
        </h2>
        <button onClick={() => onNavigate("next")} className="p-2 rounded-full hover:bg-foreground/5">
          ›
        </button>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter…"
          className="w-full px-3 py-1.5 rounded-lg bg-background border border-border/50 text-sm"
        />
        <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border/50">
          {["day", "week", "month", "agenda"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-md text-sm capitalize ${
                viewMode === mode ? "bg-[var(--primary)]/30 text-[var(--primary)]" : ""
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <button onClick={() => onNavigate("today")} className="px-3 py-1.5 rounded-lg text-sm bg-[var(--primary)]/20 text-[var(--primary)]">
          Today
        </button>
      </div>
    </div>
  );
}

// ---------- Month View ----------
function MonthView({ currentDate, items, setModalData }) {
  const daysInMonth = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const days = [];
    const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const prevLast = new Date(y, m, 0).getDate();

    for (let i = startDay; i > 0; i--) days.push(new Date(y, m - 1, prevLast - i + 1));
    for (let i = 1; i <= last.getDate(); i++) days.push(new Date(y, m, i));
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push(new Date(y, m + 1, i));
    return days;
  }, [currentDate]);

  const itemsByDate = useMemo(() => {
    const map = new Map();
    items.forEach((it) => {
      const key = new Date(it.date + "T00:00:00").toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    });
    map.forEach((arr) => arr.sort((a, b) => (a.type === "Hearing" ? -1 : 1)));
    return map;
  }, [items]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex flex-col flex-grow min-h-0">
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((d) => (
          <div key={d} className="py-2 text-xs font-bold uppercase text-muted text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 gap-2 flex-grow min-h-0">
        {daysInMonth.map((day, idx) => {
          const isCurrMonth = day.getMonth() === currentDate.getMonth();
          const isToday = new Date().toDateString() === day.toDateString();
          const dayItems = itemsByDate.get(day.toDateString()) || [];
          return (
            <div
              key={idx}
              className={`rounded-lg p-1 flex flex-col overflow-hidden ${isCurrMonth ? "bg-background" : "bg-transparent"} ${dayItems.length ? "cursor-pointer hover:bg-foreground/5" : ""}`}
              onClick={() => dayItems.length && setModalData({ date: day, items: dayItems })}
            >
              <span
                className={`font-semibold text-xs md:text-sm mb-1 self-center ${
                  isToday ? "bg-[var(--primary)] text-black rounded-full w-6 h-6 flex items-center justify-center" : isCurrMonth ? "" : "text-muted"
                }`}
              >
                {day.getDate()}
              </span>
              <div className="space-y-1 overflow-y-auto text-left flex-1 p-1 min-h-0">
                {dayItems.slice(0, 2).map((it) => (
                  <div key={it.id} className={`${it.colorClass} text-xs rounded px-1.5 py-0.5 truncate flex items-center gap-1`}>
                    {it.title}
                    {it.attachments?.length ? <PaperclipIcon /> : null}
                  </div>
                ))}
                {dayItems.length > 2 && (
                  <div className="text-xs text-muted font-medium mt-1">+{dayItems.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Week View ----------
function WeekView({ currentDate, items, onNavigateToCase }) {
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const itemsByDate = useMemo(() => {
    const map = new Map();
    items.forEach((it) => {
      const key = new Date(it.date + "T00:00:00").toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    });
    map.forEach((arr) => arr.sort((a, b) => (a.time || "23:59").localeCompare(b.time || "23:59")));
    return map;
  }, [items]);

  const renderItem = (it) => {
    const content = (
      <>
        <p className="font-bold truncate flex items-center gap-1.5">
          {it.time ? `${it.time} ` : ""}{it.title}
          {it.attachments?.length ? <PaperclipIcon /> : null}
        </p>
        <p className="opacity-80 truncate">{it.caseInfo}</p>
      </>
    );
    const cls = `w-full text-left p-1.5 rounded text-xs ${it.colorClass}`;
    return it.caseId ? (
      <button key={it.id} onClick={() => onNavigateToCase(it.caseId)} className={cls}>{content}</button>
    ) : (
      <div key={it.id} className={cls}>{content}</div>
    );
  };

  return (
    <div className="grid grid-cols-7 gap-2 h-full">
      {weekDays.map((day) => {
        const dayItems = itemsByDate.get(day.toDateString()) || [];
        const isToday = new Date().toDateString() === day.toDateString();
        return (
          <div key={day.toISOString()} className="bg-background rounded-lg flex flex-col">
            <div className="p-2 border-b border-border/40 text-center">
              <p className="text-xs uppercase text-muted">{day.toLocaleDateString("default", { weekday: "short" })}</p>
              <p className={`text-lg font-bold ${isToday ? "text-[var(--primary)]" : ""}`}>{day.getDate()}</p>
            </div>
            <div className="p-1 space-y-1 overflow-y-auto flex-1">
              {dayItems.map(renderItem)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Day View ----------
function DayView({ currentDate, items, onNavigateToCase }) {
  const dayItems = useMemo(
    () =>
      items
        .filter((it) => new Date(it.date + "T00:00:00").toDateString() === currentDate.toDateString())
        .sort((a, b) => (a.time || "23:59").localeCompare(b.time || "23:59")),
    [items, currentDate]
  );

  const renderItem = (it) => {
    const description = it.item?.description || it.item?.notes;
    const content = (
      <>
        <p className="font-bold flex items-center gap-2">
          {it.title} <span className="opacity-80 text-sm">({it.caseInfo})</span> {it.attachments?.length ? <PaperclipIcon /> : null}
        </p>
        <p className="text-sm opacity-90">{description || "No description"}</p>
      </>
    );
    const cls = `w-full text-left p-2 rounded-lg ${it.colorClass}`;
    return it.caseId ? (
      <button key={it.id} onClick={() => onNavigateToCase(it.caseId)} className={cls}>{content}</button>
    ) : (
      <div key={it.id} className={cls}>{content}</div>
    );
  };

  const slots = Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);

  return (
    <div className="flex flex-col">
      {slots.map((time) => {
        const slotItems = dayItems.filter((it) => it.time?.startsWith(time.split(":")[0]));
        return (
          <div key={time} className="flex items-start border-b border-border/40 py-2">
            <div className="w-20 text-right pr-4 text-sm text-muted">{time}</div>
            <div className="flex-1 space-y-2">{slotItems.map(renderItem)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Agenda View ----------
function AgendaView({ items, onNavigateToCase }) {
  const sorted = useMemo(() => [...items].sort((a, b) => new Date(a.date) - new Date(b.date)), [items]);

  const groups = useMemo(() => {
    const m = new Map();
    sorted.forEach((it) => {
      const d = new Date(it.date + "T00:00:00");
      const key = d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(it);
    });
    return Array.from(m.entries());
  }, [sorted]);

  const renderItem = (it) => {
    const content = (
      <>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-10 rounded-full ${it.colorClass}`} />
          <div>
            <p className="font-semibold flex items-center gap-2">
              {it.title} {it.attachments?.length ? <PaperclipIcon /> : null}
            </p>
            <p className="text-sm text-muted">
              {it.caseInfo} {it.time && `at ${it.time}`}
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${it.colorClass}`}>{it.type}</span>
      </>
    );
    const cls = "w-full text-left p-3 rounded-lg flex items-center justify-between gap-4 bg-background hover:bg-foreground/5 transition-colors";
    return it.caseId ? (
      <button key={it.id} onClick={() => onNavigateToCase(it.caseId)} className={cls}>{content}</button>
    ) : (
      <div key={it.id} className={cls}>{content}</div>
    );
  };

  return (
    <div className="p-2 space-y-6">
      {groups.length ? (
        groups.map(([dateStr, dayItems]) => (
          <div key={dateStr}>
            <h3 className="text-lg font-semibold text-[var(--primary)] border-b border-border/50 pb-2 mb-3">{dateStr}</h3>
            <div className="space-y-2">{dayItems.map(renderItem)}</div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted py-10">No events match your filter.</p>
      )}
    </div>
  );
}

// ---------- Day Detail Modal ----------
function DayDetailModal({ modalData, onClose, onNavigateToCase }) {
  const renderItem = (it) => {
    const content = (
      <>
        <div className={`w-2 h-10 rounded-full flex-shrink-0 ${it.colorClass}`} />
        <div>
          <p className="font-semibold flex items-center gap-2">
            {it.title} {it.attachments?.length ? <PaperclipIcon /> : null}
          </p>
          <p className="text-sm text-muted">{it.caseInfo}</p>
        </div>
      </>
    );
    const cls = "w-full text-left p-3 rounded-lg flex items-center gap-3 bg-background hover:bg-foreground/5 transition-colors";
    return it.caseId ? (
      <button key={it.id} onClick={() => { onNavigateToCase(it.caseId); onClose(); }} className={cls}>{content}</button>
    ) : (
      <div key={it.id} className={cls}>{content}</div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[70vh] rounded-2xl border border-border/50 bg-[var(--bg-elev)] flex flex-col">
        <h2 className="text-xl font-bold text-[var(--primary)] p-6 border-b border-border/50">
          {modalData.date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </h2>
        <div className="p-6 overflow-y-auto space-y-3">
          {modalData.items.map(renderItem)}
        </div>
        <div className="p-4 border-t border-border/50 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border/40 hover:bg-foreground/5">Close</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Quick Event Modal ----------
function QuickEventModal({ cases, initialData, onClose, onSaveSuccess }) {
  const [eventType, setEventType] = useState(initialData.type); // 'Hearing' | 'Task' | 'General'
  const [caseId, setCaseId] = useState(initialData.caseId || "");
  const [title, setTitle] = useState(initialData.title || "");
  const [date, setDate] = useState(initialData.date || new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState(initialData.description || "");
  const [attachments, setAttachments] = useState([]);
  const [priority, setPriority] = useState("Medium"); // for Task
  const [time, setTime] = useState(initialData.time || "10:00"); // for Hearing/General
  const [court, setCourt] = useState(""); // for Hearing
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputCls = "w-full mt-1 bg-background text-foreground p-2 rounded-lg border border-border/50";

  const onAttach = (e) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setAttachments((prev) => [...new Set([...prev, ...names])]);
    }
  };
  const removeAttachment = (name) => setAttachments((prev) => prev.filter((n) => n !== name));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (eventType === "General") {
        const start = new Date(`${date}T${time || "09:00"}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        addEvent({ title, start: start.toISOString(), end: end.toISOString(), description, attachments });
      } else if (eventType === "Hearing") {
        if (!caseId) { alert("Please select a case."); setIsSubmitting(false); return; }
        // For demo, push into the case’s hearings array in local demo store if you want.
        // Simpler: create a General event styled as hearing? — but we already show case hearings only from getDemoCases().
        // For a true demo, we’ll just create a General event that still shows on calendar:
        const start = new Date(`${date}T${time || "10:00"}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        addEvent({ title: `Hearing: ${title} (${court || "Court"})`, start: start.toISOString(), end: end.toISOString(), description, attachments });
      } else {
        // Task (global or case). For demo, global tasks store only.
        addGlobalTask({ title, dueDate: date, description, priority, attachments });
      }
      onSaveSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save event.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6">
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-6">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-2">
          <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border/50">
            {["General", "Task", "Hearing"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setEventType(t)}
                className={`w-full p-2 rounded-md ${eventType === t ? "bg-[var(--primary)]/30 text-[var(--primary)]" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>

          {eventType !== "General" && (
            <div>
              <label>Case {eventType === "Task" ? "(Optional for demo)" : "*"}</label>
              <select value={caseId} onChange={(e) => setCaseId(e.target.value)} className={inputCls}>
                <option value="">-- Select --</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>{c.caseNumber}/{c.year}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label>Title*</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>{eventType === "Task" ? "Due Date*" : "Date*"}</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputCls} />
            </div>
            {eventType !== "Task" && (
              <div>
                <label>Time*</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={inputCls} />
              </div>
            )}
          </div>

          <div>
            <label>Description / Notes</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls} />
          </div>

          {eventType === "Hearing" && (
            <div>
              <label>Court/Judge</label>
              <input value={court} onChange={(e) => setCourt(e.target.value)} className={inputCls} />
            </div>
          )}
          {eventType === "Task" && (
            <div>
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputCls}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
          )}

          <div>
            <label>Attachments</label>
            <div className="mt-1 flex items-center gap-2">
              <label htmlFor="e-attachments" className="cursor-pointer text-sm px-3 py-1.5 border border-border/50 rounded-lg hover:bg-foreground/5">
                Add Files…
              </label>
              <input id="e-attachments" type="file" multiple onChange={onAttach} className="hidden" />
            </div>
            {!!attachments.length && (
              <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                {attachments.map((n) => (
                  <div key={n} className="text-xs bg-background p-1.5 rounded flex justify-between items-center">
                    <span className="truncate pr-2">{n}</span>
                    <button type="button" onClick={() => removeAttachment(n)} className="text-red-400 font-bold">&times;</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-4 pt-4 border-t border-border/50">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border/40 hover:bg-foreground/5">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-black font-bold disabled:opacity-50">
              {isSubmitting ? "Saving…" : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
