import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JsonUploadForm from "@/components/admin/JsonUploadForm";

export default async function FreeUploadPage() {
  const courses = await prisma.course.findMany({ orderBy: { id: "asc" } });

  const sampleJson = `[
  {
    "subject": "공중보건학",
    "content": "다음 중 소독에 대한 설명으로 옳은 것은?",
    "option_1": "병원성 미생물을 제거하는 것",
    "option_2": "모든 미생물을 완전히 사멸시키는 것",
    "option_3": "세균의 포자까지 제거하는 것",
    "option_4": "미생물의 발육을 정지시키는 것",
    "answer": 1,
    "explanation": "소독은 병원성 미생물을 제거·약화시키는 것을 의미합니다.",
    "difficulty": 2
  }
]`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-beauty-neutral">🆓 무료체험 문제 일괄 업로드 (JSON)</h1>
        <Link href="/admin/free-questions" className="btn-outline px-4 py-2 text-sm">
          ← 무료체험 문제 관리
        </Link>
      </div>
      <p className="mb-6 text-beauty-gray">
        각 자격증별 <b>무료체험용 100문제</b>를 JSON 파일로 업로드합니다. 업로드되는 문제는 형식과
        관계없이 모두 <b>무료(무료체험)</b>로 자동 등록됩니다.
      </p>

      <div className="card mb-6">
        <h2 className="mb-3 font-bold text-beauty-neutral">JSON 형식</h2>
        <ul className="mb-4 space-y-1 text-sm text-beauty-gray">
          <li>• 최상위는 <b>문제 객체 배열</b> 입니다. (<code>{`{ "questions": [...] }`}</code> 형태도 허용)</li>
          <li>• 필수: <code>content</code>, <code>option_1</code> ~ <code>option_4</code>, <code>answer</code>(1~4)</li>
          <li>• 선택: <code>subject</code>(키워드/과목), <code>explanation</code>, <code>difficulty</code>(1=쉬움/2=보통/3=어려움)</li>
          <li>• <code>option_1~4</code> 대신 <code>{'options: ["보기1","보기2","보기3","보기4"]'}</code> 배열도 가능합니다.</li>
          <li>• <code>is_free</code> 값은 무시되며, 모든 문제가 무료체험으로 등록됩니다.</li>
        </ul>
        <pre className="overflow-x-auto rounded-btn bg-primary-pale/30 p-4 text-xs text-beauty-neutral">
{sampleJson}
        </pre>
      </div>

      <JsonUploadForm courses={courses} forceFree />
    </div>
  );
}
