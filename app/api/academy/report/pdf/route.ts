import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildAcademyReportPdf } from "@/lib/academy-pdf";
import { getAcademyStats, getAcademyStudents } from "@/lib/academy-stats";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user?.academyId || !["owner", "teacher", "branch_admin"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const academy = await prisma.academy.findUnique({ where: { id: user.academyId } });
  const [stats, students] = await Promise.all([
    getAcademyStats(user.academyId),
    getAcademyStudents(user.academyId),
  ]);

  const pdfBytes = buildAcademyReportPdf(academy?.name ?? "Academy", students, stats);
  const filename = `passmaster-report-${academy?.name ?? "academy"}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
