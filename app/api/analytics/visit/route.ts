import { NextResponse } from "next/server";
import { recordVisitReferrer } from "@/lib/referrer-analytics";

export const dynamic = "force-dynamic";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET || process.env.AUTH_SECRET || "";
  if (!secret) return process.env.NODE_ENV === "development";
  return req.headers.get("x-analytics-secret") === secret;
}

/** 미들웨어에서 호출 — 일별 Referrer 도메인 집계 */
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { referer?: string; host?: string };
    const host = body.host?.trim();
    if (!host) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await recordVisitReferrer(body.referer ?? null, host);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[analytics/visit]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
