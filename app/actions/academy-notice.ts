"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSubsiteStaff } from "@/lib/academy-subsite";

export async function createAcademyNoticeAction(formData: FormData): Promise<void> {
  const subdomain = String(formData.get("subdomain") || "");
  const { academy } = await requireSubsiteStaff(subdomain);
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const isPinned = formData.get("isPinned") === "on";
  if (!title || !content) return;

  await prisma.academyNotice.create({
    data: { academyId: academy.id, title, content, isPinned },
  });
  revalidatePath(`/a/${subdomain}/board`);
  revalidatePath(`/a/${subdomain}/admin/board`);
}

export async function deleteAcademyNoticeAction(formData: FormData): Promise<void> {
  const subdomain = String(formData.get("subdomain") || "");
  const id = Number(formData.get("id"));
  const { academy } = await requireSubsiteStaff(subdomain);

  await prisma.academyNotice.deleteMany({ where: { id, academyId: academy.id } });
  revalidatePath(`/a/${subdomain}/admin/board`);
  revalidatePath(`/a/${subdomain}/board`);
}
