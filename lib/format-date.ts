export function coerceDate(d: Date | string | null | undefined): Date | null {
  if (!d) return null;
  if (d instanceof Date) return d;
  const parsed = new Date(d);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateYmd(d: Date | string | null | undefined): string {
  const date = coerceDate(d);
  return date ? date.toISOString().slice(0, 10) : "";
}

export function formatDateKo(d: Date | string | null | undefined): string {
  const date = coerceDate(d);
  return date ? date.toLocaleDateString("ko-KR") : "-";
}
