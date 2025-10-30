// lib/ai.js
// Lightweight mocks for analyze/generate until backend/LLM is wired

export async function analyzeNoticeText(text) {
  // Pretend we parsed; return safe defaults if unknown
  return {
    sender: "Unknown Sender",
    recipient: "Unknown Recipient",
    noticeDate: new Date().toISOString().split("T")[0],
    replyByDate: "",
    summary: text.slice(0, 240) + (text.length > 240 ? "…" : ""),
  };
}

export async function generateNoticeDraft(template, keyPoints, context = {}) {
  const sender = context?.sender?.name || "Sender";
  const recipient = context?.recipient?.name || "Recipient";
  const caseInfo = context?.caseInfo
    ? `${context.caseInfo.caseNumber}/${context.caseInfo.year}`
    : "N/A";

  return `Template: ${template.name}
Case: ${caseInfo}
From: ${sender}
To: ${recipient}

Key Points:
${keyPoints}

Body:
This is a demo-generated draft. Replace with your LLM output once ready.`;
}
