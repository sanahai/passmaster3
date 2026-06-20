import SubsiteHeader from "@/components/academy-subsite/SubsiteHeader";
import SidebarAdmin from "@/components/academy-subsite/SidebarAdmin";
import { requireSubsiteStaff } from "@/lib/academy-subsite";
import { brandForAcademy } from "@/lib/brand";
import { getAcademyStats } from "@/lib/academy-stats";

export const dynamic = "force-dynamic";

export default async function AdminSubsiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subdomain: string };
}) {
  const { academy, session } = await requireSubsiteStaff(params.subdomain);
  const brand = brandForAcademy(academy.brand);
  const stats = await getAcademyStats(academy.id);

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <SidebarAdmin subdomain={params.subdomain} tier={academy.tier} studentCount={stats.total} />
      <div className="flex min-h-screen flex-1 flex-col">
        <SubsiteHeader
          subdomain={params.subdomain}
          academyName={academy.name}
          logoUrl={academy.logoUrl}
          brand={brand}
          role="admin"
          userName={session.name}
        />
        <main className="flex-1 overflow-auto bg-slate-900 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
