// components/notices/_noticeTemplateStore.js
// Demo notice templates

const _templates = [
  { id: "tpl1", name: "General Legal Notice" },
  { id: "tpl2", name: "Payment Demand Notice" },
  { id: "tpl3", name: "Public Notice - Newspaper" },
  { id: "tpl4", name: "Internal Memo" },
];

export function getNoticeTemplates() {
  return [..._templates];
}
