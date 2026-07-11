import { prisma } from "@/lib/prisma";

const KST = "Asia/Seoul";

/** KST 기준 YYYY-MM-DD */
export function kstDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: KST }).format(date);
}

export function parseKstDateString(value: string | undefined | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Referer URL → 도메인만 (www. 제거). 동일 사이트·없음은 한글 라벨 */
export function extractReferrerDomain(referer: string | null | undefined, siteHost: string): string {
  const normalizedHost = siteHost.replace(/^www\./, "").toLowerCase();

  if (!referer?.trim()) {
    return "(직접 접속)";
  }

  try {
    const url = new URL(referer);
    const refHost = url.hostname.replace(/^www\./, "").toLowerCase();
    if (!refHost) return "(직접 접속)";
    if (refHost === normalizedHost) return "(사이트 내부)";
    return refHost;
  } catch {
    return "(알 수 없음)";
  }
}

export async function recordVisitReferrer(referer: string | null | undefined, siteHost: string) {
  const domain = extractReferrerDomain(referer, siteHost);
  const dateStr = kstDateString();
  const date = new Date(`${dateStr}T00:00:00.000Z`);

  await prisma.visitReferrerDaily.upsert({
    where: {
      date_referrerDomain: { date, referrerDomain: domain },
    },
    create: { date, referrerDomain: domain, visitCount: 1 },
    update: { visitCount: { increment: 1 } },
  });
}

export type ReferrerDayRow = {
  referrerDomain: string;
  visitCount: number;
  sharePct: number;
};

export async function getReferrerStatsForDate(date: Date): Promise<{
  dateLabel: string;
  total: number;
  rows: ReferrerDayRow[];
}> {
  const grouped = await prisma.visitReferrerDaily.findMany({
    where: { date },
    orderBy: { visitCount: "desc" },
  });

  const total = grouped.reduce((sum, r) => sum + r.visitCount, 0);
  const rows: ReferrerDayRow[] = grouped.map((r) => ({
    referrerDomain: r.referrerDomain,
    visitCount: r.visitCount,
    sharePct: total > 0 ? Math.round((r.visitCount / total) * 1000) / 10 : 0,
  }));

  return {
    dateLabel: date.toISOString().slice(0, 10),
    total,
    rows,
  };
}
