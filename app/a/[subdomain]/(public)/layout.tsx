import AcademyPortalHeader from "@/components/academy-portal/AcademyPortalHeader";
import AcademyPortalFooter from "@/components/academy-portal/AcademyPortalFooter";
import { getAcademyBySubdomain } from "@/lib/academy-portal";

export default async function PublicPortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subdomain: string };
}) {
  const academy = await getAcademyBySubdomain(params.subdomain);
  if (!academy) return children;

  return (
    <div className="flex min-h-screen flex-col bg-b2b-light">
      <AcademyPortalHeader academy={academy} subdomain={params.subdomain} />
      <main className="flex-1">{children}</main>
      <AcademyPortalFooter academy={academy} />
    </div>
  );
}
