import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** B2B DB 스키마·학원 포털 URL 진단 */
export async function GET() {
  try {
    const academies = await prisma.academy.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        subdomain: true,
        brand: true,
        activeUntil: true,
      },
      orderBy: { id: "asc" },
    });

    const [owner] = await Promise.all([
      prisma.user.findFirst({
        where: { role: "owner" },
        select: { id: true, email: true, academyId: true },
      }),
    ]);

    const portals = academies.map((a) => ({
      id: a.id,
      name: a.name,
      code: a.code,
      subdomain: a.subdomain,
      landingUrl: a.subdomain ? `/a/${a.subdomain}` : null,
      codeUrl: a.code ? `/a/code/${a.code}` : null,
      active: a.activeUntil >= new Date(),
    }));

    return NextResponse.json({
      ok: true,
      academyCount: academies.length,
      sampleOwner: owner,
      portals,
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
