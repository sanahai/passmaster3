import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const u = await p.user.findUnique({
  where: { email: "owner@demo.academy" },
  include: { academy: true },
});
console.log(JSON.stringify(u, null, 2));
await p.$disconnect();
