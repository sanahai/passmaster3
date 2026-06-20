import { notFound } from "next/navigation";
import { getAcademyBySubdomain } from "@/lib/academy-portal";
import { subsiteThemeStyle } from "@/lib/academy-subsite";
import { getBrand } from "@/lib/brand";

export default async function SubdomainRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subdomain: string };
}) {
  const academy = await getAcademyBySubdomain(params.subdomain);
  if (!academy) notFound();
  const brand = getBrand(academy.brand);

  return (
    <div
      className="min-h-screen font-kr"
      data-brand={brand.id}
      style={subsiteThemeStyle(academy, academy.brand)}
    >
      {children}
    </div>
  );
}

export async function generateMetadata({ params }: { params: { subdomain: string } }) {
  const academy = await getAcademyBySubdomain(params.subdomain);
  if (!academy) return { title: "학원을 찾을 수 없습니다" };
  const brand = getBrand(academy.brand);
  return {
    title: `${academy.name} | ${brand.name} 제휴학원`,
    description: `${academy.name} 수강생 전용 ${brand.tagline}`,
  };
}
