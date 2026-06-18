import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAcademyStaff } from "@/lib/academy-access";
import { getStudentDetail } from "@/lib/academy-stats";
import { prisma } from "@/lib/prisma";

export default async function AcademyStudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, academy } = await requireAcademyStaff();
  const studentId = Number(params.id);
  const detail = await getStudentDetail(studentId);
  if (!detail?.user || detail.user.academyId !== academy.id) notFound();

  if (user.role === "teacher") {
    const ok = await prisma.academyGroup.findFirst({
      where: { teacherId: user.id, members: { some: { id: studentId } } },
    });
    if (!ok) notFound();
  }

  const { user: student, accuracy, answerCount, subjectStats, progress, mocks, wrongNotes } = detail;

  return (
    <div>
      <Link href="/academy/dashboard" className="mb-4 inline-block text-sm text-b2b-accent hover:underline">
        ← 학생 목록
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-b2b-primary">{student.name}</h1>
      <p className="mb-6 text-sm text-slate-500">
        {student.email} · 가입 {student.createdAt.toLocaleDateString("ko-KR")} · 풀이 {answerCount}문항 · 정답률 {accuracy}%
      </p>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="b2b-card">
          <h2 className="mb-4 font-bold">과목별 정답률</h2>
          {subjectStats.length === 0 ? (
            <p className="text-sm text-slate-500">아직 풀이 기록이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {subjectStats.map((s) => (
                <div key={s.subject}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{s.subject}</span>
                    <span className="font-bold">{s.accuracy}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-b2b-section">
                    <div className="h-full bg-b2b-teal" style={{ width: `${s.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="b2b-card">
          <h2 className="mb-4 font-bold">반복학습 진행</h2>
          {progress.length === 0 ? (
            <p className="text-sm text-slate-500">등록된 학습 과정이 없습니다.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {progress.map((p) => (
                <li key={p.id} className="rounded-lg bg-b2b-section px-3 py-2">
                  <div className="font-semibold">{p.course.name}</div>
                  <div className="text-slate-600">
                    1회차 {p.round1Done ? "✓" : "—"} · 2회차 {p.round2Done ? "✓" : "—"} · 3회차{" "}
                    {p.round3Done ? "✓" : "—"} · 모의 {p.mockDone}/6
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mb-6 b2b-card">
        <h2 className="mb-4 font-bold">모의고사 이력</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-2">과정</th>
              <th>회차</th>
              <th>점수</th>
              <th>결과</th>
              <th>일시</th>
            </tr>
          </thead>
          <tbody>
            {mocks.map((m) => (
              <tr key={m.id} className="border-b border-slate-50">
                <td className="py-2">{m.course.name}</td>
                <td>{m.mockNumber}회</td>
                <td>{m.score ?? "-"}점</td>
                <td>{(m.score ?? 0) >= m.passScore ? "합격" : "불합격"}</td>
                <td>{m.completedAt?.toLocaleDateString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {mocks.length === 0 && <p className="text-sm text-slate-500">모의고사 기록 없음</p>}
      </div>

      <div className="b2b-card">
        <h2 className="mb-4 font-bold">최근 오답 (미해결)</h2>
        <ul className="space-y-2 text-sm">
          {wrongNotes.map((w) => (
            <li key={w.id} className="rounded-lg border border-b2b-border px-3 py-2">
              <span className="text-xs text-b2b-accent">{w.question.subject}</span>
              <p className="line-clamp-2">{w.question.content}</p>
            </li>
          ))}
        </ul>
        {wrongNotes.length === 0 && <p className="text-sm text-slate-500">미해결 오답 없음</p>}
      </div>
    </div>
  );
}
