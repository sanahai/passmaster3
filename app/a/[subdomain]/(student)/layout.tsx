import SubsiteHeader, { SubsiteMobileNav } from "@/components/academy-subsite/SubsiteHeader";
import SidebarStudent, { STUDENT_MOBILE_NAV } from "@/components/academy-subsite/SidebarStudent";
import SubsiteFooter from "@/components/academy-subsite/SubsiteFooter";
import { requireSubsiteStudent, getStudentSubsiteStats } from "@/lib/academy-subsite";
import { brandForAcademy } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function StudentSubsiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subdomain: string };
}) {
  const { academy, session, user } = await requireSubsiteStudent(params.subdomain);
  const brand = brandForAcademy(academy.brand);
  const stats = await getStudentSubsiteStats(user.id);
  const daysLeft = stats.enrollments[0]?.expiresAt
    ? Math.max(0, Math.ceil((stats.enrollments[0].expiresAt.getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarStudent
        subdomain={params.subdomain}
        academyName={academy.name}
        daysLeft={daysLeft}
      />
      <div className="flex min-h-screen flex-1 flex-col pb-16 lg:pb-0">
        <SubsiteHeader
          subdomain={params.subdomain}
          academyName={academy.name}
          logoUrl={academy.logoUrl}
          brand={brand}
          role="student"
          userName={session.name}
        />
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
        <SubsiteFooter academyName={academy.name} brand={brand} />
      </div>
      <SubsiteMobileNav subdomain={params.subdomain} items={STUDENT_MOBILE_NAV} />
    </div>
  );
}
