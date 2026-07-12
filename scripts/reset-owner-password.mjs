/**
 * 원장(또는 지정 이메일) 비밀번호 초기화
 * 사용: node scripts/reset-owner-password.mjs [email] [newPassword]
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const email = (process.argv[2] || "sanahai@naver.com").trim().toLowerCase();
const newPassword = process.argv[3] || "owner1234";

if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
  console.error("비밀번호는 8자 이상, 영문+숫자 포함이어야 합니다.");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`사용자 없음: ${email}`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { passwordHash, emailVerified: true },
  });

  console.log(`✔ 비밀번호 초기화 완료`);
  console.log(`  이메일: ${email}`);
  console.log(`  역할: ${user.role}`);
  console.log(`  임시 비밀번호: ${newPassword}`);
  console.log(`  로그인 후 반드시 비밀번호를 변경하세요.`);
} finally {
  await prisma.$disconnect();
}
