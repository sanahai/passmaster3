import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createQuestionAction, toggleQuestionAction } from "@/app/actions/admin";
import DeleteSampleButton from "@/components/admin/DeleteSampleButton";

const PAGE_SIZE = 15;

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: { course?: string; page?: string; q?: string };
}) {
  const courses = await prisma.course.findMany({ orderBy: { id: "asc" } });
  const courseId = searchParams.course ? Number(searchParams.course) : courses[0]?.id;
  const selectedCourse = courses.find((c) => c.id === courseId);
  const page = Math.max(1, Number(searchParams.page) || 1);
  const query = (searchParams.q || "").trim();

  const where: Prisma.QuestionWhereInput = { courseId };
  if (query) {
    const or: Prisma.QuestionWhereInput[] = [
      { content: { contains: query, mode: "insensitive" } },
      { subject: { contains: query, mode: "insensitive" } },
      { option1: { contains: query, mode: "insensitive" } },
      { option2: { contains: query, mode: "insensitive" } },
      { option3: { contains: query, mode: "insensitive" } },
      { option4: { contains: query, mode: "insensitive" } },
    ];
    const asNum = Number(query);
    if (Number.isInteger(asNum) && asNum > 0) or.push({ id: asNum });
    where.OR = or;
  }

  const [total, questions] = await Promise.all([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (opts: { course?: number; page?: number; q?: string }) => {
    const params = new URLSearchParams();
    params.set("course", String(opts.course ?? courseId));
    if (opts.q ?? query) params.set("q", opts.q ?? query);
    if (opts.page && opts.page > 1) params.set("page", String(opts.page));
    return `/admin/questions?${params.toString()}`;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-beauty-neutral">문제 관리</h1>
        <div className="flex gap-2">
          {selectedCourse && (
            <Link
              href={`/learn/${selectedCourse.slug}`}
              target="_blank"
              className="btn-outline px-4 py-2 text-sm"
            >
              🔍 검토 학습
            </Link>
          )}
          <DeleteSampleButton />
          <Link href="/admin/questions/upload" className="btn-outline px-4 py-2 text-sm">
            ⬆️ 일괄 업로드
          </Link>
        </div>
      </div>

      {/* 과정 필터 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {courses.map((c) => (
          <Link
            key={c.id}
            href={buildHref({ course: c.id, page: 1 })}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              c.id === courseId
                ? "bg-primary text-white"
                : "bg-white text-beauty-neutral shadow-card hover:text-primary"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* 검색 */}
      <form method="get" action="/admin/questions" className="mb-6 flex gap-2">
        <input type="hidden" name="course" value={courseId} />
        <input
          name="q"
          defaultValue={query}
          className="input flex-1"
          placeholder="지문·보기·과목(키워드)·문제ID로 검색"
        />
        <button type="submit" className="btn-primary px-5">검색</button>
        {query && (
          <Link href={buildHref({ q: "", page: 1 })} className="btn-outline px-5">
            초기화
          </Link>
        )}
      </form>

      {/* 신규 문제 등록 */}
      <details className="card mb-6">
        <summary className="cursor-pointer font-bold text-primary">+ 새 문제 등록</summary>
        <form action={createQuestionAction} className="mt-4 space-y-3">
          <input type="hidden" name="courseId" value={courseId} />
          <div className="grid grid-cols-2 gap-3">
            <input name="subject" className="input" placeholder="과목명" required />
            <select name="difficulty" className="input" defaultValue="2">
              <option value="1">쉬움</option>
              <option value="2">보통</option>
              <option value="3">어려움</option>
            </select>
          </div>
          <textarea name="content" className="input" placeholder="문제 지문" rows={2} required />
          <div className="grid grid-cols-2 gap-3">
            <input name="option1" className="input" placeholder="보기 1" required />
            <input name="option2" className="input" placeholder="보기 2" required />
            <input name="option3" className="input" placeholder="보기 3" required />
            <input name="option4" className="input" placeholder="보기 4" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select name="answer" className="input" defaultValue="1">
              <option value="1">정답: 1번</option>
              <option value="2">정답: 2번</option>
              <option value="3">정답: 3번</option>
              <option value="4">정답: 4번</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-beauty-gray">
              <input type="checkbox" name="isFree" className="h-4 w-4 accent-primary" />
              무료체험 포함
            </label>
          </div>
          <textarea name="explanation" className="input" placeholder="해설 (선택)" rows={2} />
          <button className="btn-primary">등록</button>
        </form>
      </details>

      {/* 문제 목록 */}
      <p className="mb-2 text-sm text-beauty-gray">
        {query ? (
          <>
            <span className="font-semibold text-primary">&apos;{query}&apos;</span> 검색 결과{" "}
            {total.toLocaleString()}건
          </>
        ) : (
          <>총 {total.toLocaleString()}문제</>
        )}
      </p>
      {query && total === 0 && (
        <div className="card text-center text-beauty-gray">검색 결과가 없습니다.</div>
      )}
      <div className="space-y-2">
        {questions.map((q) => (
          <div key={q.id} className={`card ${!q.isActive ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-primary-pale px-2 py-0.5 font-bold text-primary">
                    {q.subject}
                  </span>
                  <span className="text-beauty-gray">
                    난이도 {q.difficulty === 1 ? "쉬움" : q.difficulty === 2 ? "보통" : "어려움"}
                  </span>
                  {q.isFree && <span className="font-bold text-beauty-success">무료</span>}
                  {!q.isActive && <span className="font-bold text-beauty-danger">비활성</span>}
                  <span className="ml-auto text-beauty-gray">#{q.id}</span>
                </div>
                <p className="text-sm font-semibold text-beauty-neutral">{q.content}</p>
                <ul className="mt-2 space-y-1">
                  {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => {
                    const isAnswer = q.answer === i + 1;
                    return (
                      <li
                        key={i}
                        className={`flex items-center gap-2 text-sm ${
                          isAnswer ? "font-semibold text-beauty-success" : "text-beauty-neutral"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                            isAnswer
                              ? "border-beauty-success bg-[#E8F5E9]"
                              : "border-gray-300 text-beauty-gray"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span>{opt}</span>
                        {isAnswer && <span className="text-xs">✓ 정답</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <form action={toggleQuestionAction}>
                <input type="hidden" name="id" value={q.id} />
                <button className="rounded-btn border border-gray-300 px-3 py-1.5 text-xs font-semibold text-beauty-gray hover:border-primary hover:text-primary">
                  {q.isActive ? "비활성화" : "활성화"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-1">
          {Array.from({ length: totalPages }).slice(0, 20).map((_, i) => (
            <Link
              key={i}
              href={buildHref({ page: i + 1 })}
              className={`rounded-btn px-3 py-1.5 text-sm font-semibold ${
                page === i + 1 ? "bg-primary text-white" : "bg-white text-beauty-gray shadow-card"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
