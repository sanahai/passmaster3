import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const [academies, owners] = await Promise.all([
  prisma.academy.findMany({ include: { users: { where: { role: "owner" }, select: { email: true } } } }),
  prisma.user.findFirst({ where: { role: "owner" }, select: { email: true, academyId: true } }),
]);
console.log("academies:", JSON.stringify(academies, null, 2));
console.log("owner:", owners);
await prisma.$disconnect();
