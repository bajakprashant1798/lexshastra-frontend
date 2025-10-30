// Extremely light "quick add" parser.
// Heuristics:
//  - if text includes "hearing", type=Hearing
//  - if text includes "task", type=Task
//  - else type=General
//  - tries to find HH:MM like 14:30 or "2pm", "10am" for time
//  - date: if "tomorrow" → +1 day, else today
export function parseQuickEventText(text) {
  const lower = text.toLowerCase();

  const type = lower.includes("hearing")
    ? "Hearing"
    : lower.includes("task")
    ? "Task"
    : "General";

  // time
  let time = null;
  const hhmm = lower.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/); // 14:30
  if (hhmm) {
    time = hhmm[0];
  } else {
    const ampm = lower.match(/\b(\d{1,2})\s?(am|pm)\b/);
    if (ampm) {
      let h = parseInt(ampm[1], 10);
      const isPm = ampm[2] === "pm";
      if (h === 12 && !isPm) h = 0;
      if (isPm && h < 12) h += 12;
      time = `${String(h).padStart(2, "0")}:00`;
    }
  }

  // date
  const today = new Date();
  let date = new Date(today);
  if (lower.includes("tomorrow")) {
    date.setDate(today.getDate() + 1);
  }
  const dateStr = date.toISOString().slice(0, 10);

  // title = original text (trim)
  const title = text.trim();

  return {
    eventType: type,     // 'Hearing' | 'Task' | 'General'
    title,
    date: dateStr,       // YYYY-MM-DD
    time: time || (type === "Task" ? null : "10:00"),
    description: "",
    caseIdentifier: null, // (optional) not used in demo
  };
}
