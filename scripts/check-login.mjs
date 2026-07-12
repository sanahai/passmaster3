import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const email = (process.argv[2] || "").trim().toLowerCase();
const password = process.argv[3] || "";

const p = new PrismaClient();

const users = email
  ? await p.user.findMany({
      where: { email: { contains: email.split("@")[0] } },
      select: { id: true, email: true, role: true, name: true, academyId: true, emailVerified: true },
    })
  : await p.user.findMany({
      select: { id: true, email: true, role: true, name: true, academyId: true, emailVerified: true },
      orderBy: { id: "asc" },
    });

console.log("=== users ===");
console.log(JSON.stringify(users, null, 2));

if (email && password) {
  const user = await p.user.findUnique({ where: { email } });
  if (!user) {
    console.log("\n❌ user not found:", email);
  } else {
    const ok = await bcrypt.compare(password, user.passwordHash);
    console.log(`\nlogin test ${email} / ${password}:`, ok ? "✔ OK" : "❌ WRONG PASSWORD");
    console.log("emailVerified:", user.emailVerified);
  }
}

await p.$disconnect();
