/**
 * 배포 시 subdomain 없는 학원에 URL 자동 부여 (Vercel build 단계)
 */
import { PrismaClient } from "@prisma/client";

function slugifySubdomain(input) {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return slug || `academy-${Math.random().toString(36).slice(2, 8)}`;
}

async function uniqueSubdomain(prisma, name, preferred) {
  const base = preferred?.trim() ? slugifySubdomain(preferred) : slugifySubdomain(name);
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const exists = await prisma.academy.findUnique({ where: { subdomain: candidate } });
    if (!exists) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

const prisma = new PrismaClient();

try {
  const missing = await prisma.academy.findMany({
    where: { OR: [{ subdomain: null }, { subdomain: "" }] },
    select: { id: true, name: true },
  });

  for (const academy of missing) {
    const subdomain = await uniqueSubdomain(prisma, academy.name, null);
    await prisma.academy.update({ where: { id: academy.id }, data: { subdomain } });
    console.log(`[ensure-subdomains] ${academy.name} → /a/${subdomain}`);
  }

  if (missing.length === 0) {
    console.log("[ensure-subdomains] all academies have subdomains");
  }
} finally {
  await prisma.$disconnect();
}
