import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { StudentRow } from "./academy-stats";
import { formatDateKo } from "./format-date";

// jspdf-autotable plugin typing
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export function buildAcademyReportPdf(
  academyName: string,
  students: StudentRow[],
  stats: { total: number; avgAccuracy: number; inactive7d: number },
): Uint8Array {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const date = new Date().toLocaleDateString("ko-KR");

  doc.setFontSize(16);
  doc.text(`${academyName} Learning Report`, 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated: ${date}`, 14, 26);
  doc.text(
    `Students: ${stats.total} | Avg accuracy: ${stats.avgAccuracy}% | Inactive 7d: ${stats.inactive7d}`,
    14,
    32,
  );

  autoTable(doc, {
    startY: 38,
    head: [["Name", "Email", "Group", "Accuracy", "Answers", "Status", "Last active"]],
    body: students.map((s) => [
      s.name,
      s.email,
      s.groupName ?? "-",
      `${s.accuracy}%`,
      String(s.answerCount),
      s.status.label,
      s.lastActive ? formatDateKo(s.lastActive) : "-",
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42] },
  });

  return doc.output("arraybuffer") as unknown as Uint8Array;
}
