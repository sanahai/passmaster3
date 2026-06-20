import { redirect, notFound } from "next/navigation";
import { getAcademyByCode, isAcademyActive } from "@/lib/academy-portal";

/** 학원 코드로 제휴 템플릿 사이트로 리다이렉트 (/a/code/DEMO01 → /a/demo-beauty) */
export default async function AcademyCodeRedirectPage({
  params,
}: {
  params: { code: string };
}) {
  const academy = await getAcademyByCode(params.code);
  if (!academy) notFound();
  if (!academy.subdomain) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold">{academy.name}</h1>
        <p className="text-slate-600">
          이 학원은 아직 전용 페이지 URL이 설정되지 않았습니다.
          <br />
          학원 코드 <strong className="font-mono">{academy.code}</strong>로 회원가입해 주세요.
        </p>
        <a href={`/signup?academyCode=${academy.code}`} className="b2b-btn-accent mt-6 inline-block">
          회원가입
        </a>
      </div>
    );
  }
  if (!isAcademyActive(academy)) notFound();
  redirect(`/a/${academy.subdomain}`);
}
