import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** B2B DB 스키마 상태 확인 (배포 진단용) */
export async function GET() {
  try {
    const [academyCount, owner] = await Promise.all([
      prisma.academy.count(),
      prisma.user.findFirst({ where: { role: "owner" }, select: { id: true, email: true, academyId: true } }),
    ]);
    return NextResponse.json({
      ok: true,
      academyCount,
      sampleOwner: owner,
      db: "connected",
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 },
    );
  }
}
