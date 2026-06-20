import Link from "next/link";
import { absoluteUrl } from "@/lib/site-url";

export default function AcademyPortalLinkCard({
  subdomain,
  code,
}: {
  subdomain: string | null;
  code: string | null;
}) {
  if (!subdomain) return null;

  const portalUrl = absoluteUrl(`/a/${subdomain}`);

  return (
    <div className="mb-6 b2b-card border-b2b-accent/30 bg-gradient-to-r from-b2b-primary/5 to-b2b-accent/5">
      <h2 className="mb-1 font-bold text-b2b-primary">제휴학원 전용 페이지</h2>
      <p className="mb-3 text-sm text-slate-600">
        수강생에게 아래 URL을 공유하세요. 학원 코드({code})가 포함된 회원가입으로 연결됩니다.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <code className="flex-1 break-all rounded-lg bg-white px-3 py-2 text-sm">{portalUrl}</code>
        <Link href={`/a/${subdomain}`} target="_blank" className="b2b-btn-accent shrink-0 text-sm">
          랜딩 ↗
        </Link>
        <Link href={`/a/${subdomain}/dashboard`} target="_blank" className="b2b-btn-primary shrink-0 text-sm">
          수강생 포털 ↗
        </Link>
        <Link href={`/a/${subdomain}/admin`} target="_blank" className="shrink-0 rounded-lg border border-b2b-border px-4 py-2.5 text-sm font-semibold">
          관리자 ↗
        </Link>
      </div>
    </div>
  );
}
