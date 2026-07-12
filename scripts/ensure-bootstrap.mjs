/**
 * 빈 DB(운영 최초·복구)에 최소 계정·학원 생성 — 기존 데이터는 건드리지 않음
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@passwave.kr";
const ADMIN_PASS = "admin2378";
const STUDENT_EMAIL = "student@test.com";
const STUDENT_PASS = "test1234";
const DEFAULT_OWNER_EMAIL = process.env.BOOTSTRAP_OWNER_EMAIL || "sanahai@naver.com";
const DEFAULT_OWNER_PASS = process.env.BOOTSTRAP_OWNER_PASSWORD || "owner1234";

function slugify(name) {
  const s = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);
  return s || `academy-${Date.now().toString(36)}`;
}

async function uniqueSubdomain(base) {
  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    const exists = await prisma.academy.findUnique({ where: { subdomain: candidate } });
    if (!exists) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

async function uniqueCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 30; attempt++) {
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    const exists = await prisma.academy.findUnique({ where: { code } });
    if (!exists) return code;
  }
  throw new Error("code gen failed");
}

try {
  const [, ownerCount, academyCount] = await Promise.all([
    prisma.user.count({ where: { role: "owner" } }),
    prisma.academy.count(),
  ]);

  const adminHash = await bcrypt.hash(ADMIN_PASS, 10);
  const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        passwordHash: adminHash,
        name: "관리자",
        role: "admin",
        emailVerified: true,
      },
    });
    console.log(`[bootstrap] admin created: ${ADMIN_EMAIL} / ${ADMIN_PASS}`);
  } else {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email: ADMIN_EMAIL,
        passwordHash: adminHash,
        name: "관리자",
        role: "admin",
        emailVerified: true,
      },
    });
    console.log(`[bootstrap] admin synced: ${ADMIN_EMAIL} / ${ADMIN_PASS}`);
  }

  const studentHash = await bcrypt.hash(STUDENT_PASS, 10);
  const existingStudent = await prisma.user.findUnique({ where: { email: STUDENT_EMAIL } });
  if (!existingStudent) {
    await prisma.user.create({
      data: {
        email: STUDENT_EMAIL,
        passwordHash: studentHash,
        name: "테스트학생",
        role: "student",
        emailVerified: true,
      },
    });
    console.log(`[bootstrap] student created: ${STUDENT_EMAIL} / ${STUDENT_PASS}`);
  } else {
    await prisma.user.update({
      where: { id: existingStudent.id },
      data: {
        passwordHash: studentHash,
        name: "테스트학생",
        role: "student",
        emailVerified: true,
      },
    });
    console.log(`[bootstrap] student synced: ${STUDENT_EMAIL} / ${STUDENT_PASS}`);
  }

  // 원장 계정 없거나 학원 없으면 기본 학원+원장 생성
  if (ownerCount === 0 || academyCount === 0) {
    let academy = await prisma.academy.findFirst({ orderBy: { id: "asc" } });
    if (!academy) {
      const activeUntil = new Date();
      activeUntil.setFullYear(activeUntil.getFullYear() + 1);
      academy = await prisma.academy.create({
        data: {
          name: "뷰티마스터",
          brand: process.env.NEXT_PUBLIC_BRAND || "beautymaster",
          tier: "premium",
          code: await uniqueCode(),
          subdomain: await uniqueSubdomain(slugify("beauty-master")),
          ownerEmail: DEFAULT_OWNER_EMAIL,
          maxStudents: 50,
          activeUntil,
          primaryColor: "#0F172A",
        },
      });
      console.log(`[bootstrap] academy created: ${academy.name} /a/${academy.subdomain}`);
    }

    let owner = await prisma.user.findUnique({ where: { email: DEFAULT_OWNER_EMAIL } });
    const passwordHash = await bcrypt.hash(DEFAULT_OWNER_PASS, 10);

    if (!owner) {
      owner = await prisma.user.create({
        data: {
          email: DEFAULT_OWNER_EMAIL,
          passwordHash,
          name: "원장",
          role: "owner",
          academyId: academy.id,
          emailVerified: true,
        },
      });
      console.log(`[bootstrap] owner created: ${DEFAULT_OWNER_EMAIL} / ${DEFAULT_OWNER_PASS}`);
    } else {
      await prisma.user.update({
        where: { id: owner.id },
        data: {
          passwordHash,
          role: "owner",
          academyId: academy.id,
          emailVerified: true,
        },
      });
      console.log(`[bootstrap] owner updated: ${DEFAULT_OWNER_EMAIL} / ${DEFAULT_OWNER_PASS}`);
    }
  } else {
    // 원장은 있는데 비밀번호 몰라는 경우 — BOOTSTRAP_RESET_OWNER=1 이면 sanahai 비번 재설정
    if (process.env.BOOTSTRAP_RESET_OWNER === "1") {
      const owner = await prisma.user.findUnique({ where: { email: DEFAULT_OWNER_EMAIL } });
      if (owner) {
        await prisma.user.update({
          where: { id: owner.id },
          data: { passwordHash: await bcrypt.hash(DEFAULT_OWNER_PASS, 10), emailVerified: true },
        });
        console.log(`[bootstrap] owner password reset: ${DEFAULT_OWNER_EMAIL}`);
      }
    } else {
      console.log("[bootstrap] owner+academy exist, skip");
    }
  }

  // 데모 원장 (owner@demo.academy) — 시드와 동일, 운영에도 항상 보장
  const DEMO_EMAIL = "owner@demo.academy";
  const DEMO_PASS = "owner1234";
  const demoHash = await bcrypt.hash(DEMO_PASS, 10);

  let demoAcademy =
    (await prisma.academy.findUnique({ where: { subdomain: "demo-beauty" } })) ??
    (await prisma.academy.findUnique({ where: { code: "DEMO01" } }));

  if (!demoAcademy) {
    const activeUntil = new Date();
    activeUntil.setFullYear(activeUntil.getFullYear() + 1);
    demoAcademy = await prisma.academy.create({
      data: {
        name: "데모미용학원",
        brand: "beautymaster",
        tier: "premium",
        code: "DEMO01",
        subdomain: "demo-beauty",
        ownerEmail: DEMO_EMAIL,
        maxStudents: 50,
        activeUntil,
        primaryColor: "#0F172A",
      },
    });
    console.log("[bootstrap] demo academy created: DEMO01 / demo-beauty");
  }

  const demoOwner = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (!demoOwner) {
    await prisma.user.create({
      data: {
        email: DEMO_EMAIL,
        passwordHash: demoHash,
        name: "김원장",
        role: "owner",
        academyId: demoAcademy.id,
        emailVerified: true,
      },
    });
    console.log(`[bootstrap] demo owner created: ${DEMO_EMAIL} / ${DEMO_PASS}`);
  } else {
    await prisma.user.update({
      where: { id: demoOwner.id },
      data: {
        passwordHash: demoHash,
        role: "owner",
        academyId: demoAcademy.id,
        emailVerified: true,
      },
    });
    console.log(`[bootstrap] demo owner synced: ${DEMO_EMAIL} / ${DEMO_PASS}`);
  }
} finally {
  await prisma.$disconnect();
}
