"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Option = { value: string; label: string };

export default function EnrollmentFilter({
  users,
  courses,
  statuses,
}: {
  users: Option[];
  courses: Option[];
  statuses: Option[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.push(qs ? `/admin/enrollments?${qs}` : "/admin/enrollments");
  };

  const hasFilter = params.get("user") || params.get("course") || params.get("status");

  return (
    <div className="mb-6 flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-beauty-gray">신청자</label>
        <select
          className="input min-w-[180px]"
          value={params.get("user") ?? ""}
          onChange={(e) => update("user", e.target.value)}
        >
          <option value="">전체 신청자</option>
          {users.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-beauty-gray">과정</label>
        <select
          className="input min-w-[180px]"
          value={params.get("course") ?? ""}
          onChange={(e) => update("course", e.target.value)}
        >
          <option value="">전체 과정</option>
          {courses.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-beauty-gray">상태</label>
        <select
          className="input min-w-[140px]"
          value={params.get("status") ?? ""}
          onChange={(e) => update("status", e.target.value)}
        >
          <option value="">전체 상태</option>
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {hasFilter && (
        <button
          type="button"
          onClick={() => router.push("/admin/enrollments")}
          className="btn-outline px-4 py-2 text-sm"
        >
          초기화
        </button>
      )}
    </div>
  );
}
