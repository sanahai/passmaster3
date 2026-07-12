import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const users = await p.user.findMany({
  where: { role: { in: ["owner", "admin"] } },
  select: { id: true, email: true, role: true, name: true, academyId: true },
});
console.log(JSON.stringify(users, null, 2));
await p.$disconnect();
