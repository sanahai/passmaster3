import Link from "next/link";
import { notFound } from "next/navigation";
import AcademyPortalHome from "@/components/academy-portal/AcademyPortalHome";
import { getAcademyBySubdomain, isAcademyActive } from "@/lib/academy-portal";
import { brandForAcademy } from "@/lib/brand";

export default async function AcademyPortalPage({
  params,
}: {
  params: { subdomain: string };
}) {
  const academy = await getAcademyBySubdomain(params.subdomain);
  if (!academy) notFound();
  const brand = brandForAcademy(academy.brand);

  if (!isAcademyActive(academy)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold text-b2b-primary">{academy.name}</h1>
        <p className="mb-6 text-slate-600">제휴 이용 기간이 만료되었습니다. 학원에 문의해 주세요.</p>
        <Link href="/" className="b2b-btn-accent">
          {brand.name} 홈
        </Link>
      </div>
    );
  }

  return <AcademyPortalHome academy={academy} />;
}
