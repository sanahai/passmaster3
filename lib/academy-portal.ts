import { prisma } from "./prisma";

export type AcademyPortal = {
  id: number;
  name: string;
  brand: string;
  code: string | null;
  subdomain: string | null;
  logoUrl: string | null;
  primaryColor: string;
  tier: string;
  activeUntil: Date;
};

export async function getAcademyBySubdomain(subdomain: string): Promise<AcademyPortal | null> {
  const academy = await prisma.academy.findUnique({
    where: { subdomain: subdomain.toLowerCase().trim() },
  });
  if (!academy) return null;
  return academy;
}

export async function getAcademyByCode(code: string): Promise<AcademyPortal | null> {
  const academy = await prisma.academy.findUnique({
    where: { code: code.toUpperCase().trim() },
  });
  if (!academy) return null;
  return academy;
}

export function isAcademyActive(academy: { activeUntil: Date }): boolean {
  return academy.activeUntil >= new Date();
}

export function academyPortalPath(subdomain: string): string {
  return `/a/${subdomain}`;
}

export function academySignupUrl(code: string | null): string {
  return code ? `/signup?academyCode=${encodeURIComponent(code)}` : "/signup";
}
