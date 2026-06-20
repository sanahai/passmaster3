import Link from "next/link";
import StudentTable from "@/components/academy/StudentTable";
import { requireSubsiteStaff, subsitePath } from "@/lib/academy-subsite";
import { getAcademyStudents } from "@/lib/academy-stats";

export const dynamic = "force-dynamic";

export default async function SubsiteAdminStudentsPage({
  params,
  searchParams,
}: {
  params: { subdomain: string };
  searchParams?: { q?: string; filter?: string };
}) {
  const { user, academy } = await requireSubsiteStaff(params.subdomain);
  const students = await getAcademyStudents(academy.id, {
    q: searchParams?.q,
    filter: searchParams?.filter,
    branchId: user.role === "branch_admin" ? user.branchId ?? undefined : undefined,
    teacherId: user.role === "teacher" ? user.id : undefined,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">학생 관리</h1>
          <p className="text-slate-400">총 {students.length}명</p>
        </div>
        <Link href="/academy/dashboard" className="text-sm text-slate-400 hover:text-white">
          B2B 상세 관리 →
        </Link>
      </div>
      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={searchParams?.q}
          placeholder="이름 검색"
          className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-white placeholder:text-slate-500"
        />
      </form>
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
        <StudentTable students={students} />
      </div>
      <Link href={subsitePath(params.subdomain, "/admin")} className="text-sm text-slate-400 hover:text-white">
        ← 대시보드
      </Link>
    </div>
  );
}
