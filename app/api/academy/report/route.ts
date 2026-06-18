import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { buildAcademyReportCsv } from "@/lib/academy-analytics";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user?.academyId || !["owner", "teacher", "branch_admin"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const csv = await buildAcademyReportCsv(user.academyId);
  const academy = await prisma.academy.findUnique({ where: { id: user.academyId } });
  const filename = `beautymaster-report-${academy?.name ?? "academy"}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
