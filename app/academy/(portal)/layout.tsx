import AcademyHeader from "@/components/academy/AcademyHeader";
import AcademySidebar from "@/components/academy/AcademySidebar";
import { requireAcademyStaff } from "@/lib/academy-access";

export default async function AcademyPortalLayout({ children }: { children: React.ReactNode }) {
  const { academy } = await requireAcademyStaff();

  return (
    <div className="min-h-screen bg-b2b-light">
      <AcademyHeader academyName={academy.name} logoUrl={academy.logoUrl} tier={academy.tier} />
      <div className="mx-auto flex max-w-7xl">
        {academy.tier !== "basic" && <AcademySidebar tier={academy.tier} />}
        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
