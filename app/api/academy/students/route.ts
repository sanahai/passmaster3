import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { academy: true },
  });
  if (!user?.academyId || !["owner", "teacher", "branch_admin"].includes(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const groupId = searchParams.get("groupId");
  const branchId = searchParams.get("branchId");

  const students = await prisma.user.findMany({
    where: {
      academyId: user.academyId,
      role: "student",
      ...(groupId ? { groupId: Number(groupId) } : {}),
      ...(branchId ? { branchId: Number(branchId) } : {}),
      ...(user.role === "teacher" ? { group: { teacherId: user.id } } : {}),
      ...(user.role === "branch_admin" ? { branchId: user.branchId ?? undefined } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      lastActiveAt: true,
      group: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    academy: { id: user.academy!.id, name: user.academy!.name, tier: user.academy!.tier },
    students,
  });
}
