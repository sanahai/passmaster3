import Link from "next/link";
import { requireAcademyStaff } from "@/lib/academy-access";
import { tierAtLeast } from "@/lib/academy";
import UpgradeBanner from "@/components/academy/UpgradeBanner";
import QuestionsUploadForm from "@/components/academy/QuestionsUploadForm";

export default async function AcademyQuestionsUploadPage() {
  const ctx = await requireAcademyStaff();
  if (!tierAtLeast(ctx.academy.tier, "premium")) return <UpgradeBanner />;

  return (
    <div>
      <Link href="/academy/questions" className="mb-4 inline-block text-sm text-b2b-accent hover:underline">
        ← 문제 목록
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-b2b-primary">문제 엑셀 업로드</h1>
      <p className="mb-6 text-sm text-slate-500">
        컬럼: 과목, 지문, 보기1, 보기2, 보기3, 보기4, 정답(1~4), 해설
      </p>

      <QuestionsUploadForm />

      <div className="mt-6 rounded-lg bg-b2b-section p-4 text-sm text-slate-600">
        <p className="font-semibold">샘플 형식</p>
        <pre className="mt-2 overflow-x-auto text-xs">
{`과목 | 지문 | 보기1 | 보기2 | 보기3 | 보기4 | 정답 | 해설
미용이론 | 두피의 pH는? | 4.5~5.5 | 6.0~7.0 | ... | ... | 1 | 두피는 약산성`}
        </pre>
      </div>
    </div>
  );
}
