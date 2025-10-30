// lib/causeListService.js
import { getDemoCases, addDemoHearing, updateDemoHearing } from "@/components/cases/_demoStore";

// Simulated daily cause list fetched from court portal
function generateFullCauseList(allCases) {
  const items = [
    {
      serialNumber: "1",
      caseNumber: "123/2024",
      petitioner: "Innovate Corp",
      respondent: "Global Solutions Ltd",
      petitionerCounsel: "Rohan Verma",
      respondentCounsel: "Adv. Mehra",
      purpose: "Framing of Issues",
    },
    {
      serialNumber: "12",
      caseNumber: "5555/2024",
      petitioner: "New Client Inc.",
      respondent: "Union of India",
      petitionerCounsel: "Priya Singh",
      respondentCounsel: "Govt Counsel",
      purpose: "For Admission",
    },
    {
      serialNumber: "15",
      caseNumber: "112/2022",
      petitioner: "Another Party",
      respondent: "Some Other Company",
      petitionerCounsel: "Adv. X",
      respondentCounsel: "Adv. Y",
      purpose: "For Orders",
    },
  ];

  // Add a “known” case from demo store to simulate “Action Required”
  const known = allCases.find((c) => c.caseNumber === "5678");
  if (known) {
    items.push({
      serialNumber: "8",
      caseNumber: `${known.caseNumber}/${known.year}`,
      petitioner: "Arjun Singh",
      respondent: "State of NCT of Delhi",
      petitionerCounsel: "Rohan Verma",
      respondentCounsel: "Public Prosecutor",
      purpose: "For Appearance",
    });
  }
  return items;
}

/**
 * Returns a processed cause list with status: Linked | Action Required | Unlinked
 */
export async function getProcessedCauseListForDate(date) {
  const allCases = getDemoCases();
  const fullList = generateFullCauseList(allCases);
  const dateStr = date.toISOString().split("T")[0];

  return fullList.map((item) => {
    const matched = allCases.find(
      (c) => `${c.caseNumber}/${c.year}`.toLowerCase() === item.caseNumber.toLowerCase()
    );
    if (matched) {
      const existing = (matched.hearings || []).find((h) => h.date === dateStr);
      if (existing)
        return { ...item, status: "Linked", linkedCaseId: matched.id, existingHearingId: existing.id };
      else return { ...item, status: "Action Required", linkedCaseId: matched.id };
    }

    if (
      item.petitionerCounsel.toLowerCase().includes("rohan") ||
      item.petitionerCounsel.toLowerCase().includes("priya")
    ) {
      return { ...item, status: "Unlinked" };
    }

    return { ...item, status: "Unlinked" };
  });
}

/** Simulated add hearing */
export async function addHearingForCase(caseId, payload) {
  return addDemoHearing(caseId, payload);
}

/** Simulated update hearing */
export async function updateHearingForCase(caseId, payload) {
  return updateDemoHearing(caseId, payload);
}
