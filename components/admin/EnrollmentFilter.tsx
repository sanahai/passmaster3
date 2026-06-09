"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Option = { value: string; label: string };

export default function EnrollmentFilter({
  courses,
  statuses,
}: {
  courses: Option[];
  statuses: Option[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const buildUrl = (next: URLSearchParams) => {
    const qs = next.toString();
    return qs ? `/admin/enrollments?${qs}` : "/admin/enrollments";
  };

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(buildUrl(next));
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    update("q", q.trim());
  };

  const hasFilter = params.get("q") || params.get("course") || params.get("status");

  return (
    <div className="mb-6 flex flex-wrap items-end gap-3">
      <form onSubmit={submitSearch}>
        <label className="mb-1 block text-xs font-semibold text-beauty-gray">신청자 검색</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="input min-w-[200px]"
            placeholder="이름으로 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="btn-primary px-4 py-2 text-sm">
            검색
          </button>
        </div>
      </form>

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
