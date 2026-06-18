"use client";

import Link from "next/link";
import type { StudentRow } from "@/lib/academy-stats";
import { coerceDate } from "@/lib/format-date";

function formatLastActive(d: Date | string | null) {
  const date = coerceDate(d);
  if (!date) return "기록 없음";
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  return `${days}일 전`;
}

export default function StudentTable({ students }: { students: StudentRow[] }) {
  return (
    <div className="overflow-x-auto b2b-card">
      <table className="w-full text-sm">
        <thead className="border-b border-b2b-border bg-b2b-section text-left">
          <tr>
            <th className="px-4 py-3">이름</th>
            <th className="px-4 py-3">마지막 접속</th>
            <th className="px-4 py-3">풀이 수</th>
            <th className="px-4 py-3">정답률</th>
            <th className="px-4 py-3">상태</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b border-slate-50 last:border-0">
              <td className="px-4 py-3 font-semibold text-b2b-primary">{s.name}</td>
              <td className="px-4 py-3 text-slate-600">{formatLastActive(s.lastActive)}</td>
              <td className="px-4 py-3">{s.answerCount}</td>
              <td className="px-4 py-3">{s.accuracy}%</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.status.className}`}>
                  {s.status.label}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/academy/students/${s.id}`}
                  className="text-xs font-semibold text-b2b-accent hover:underline"
                >
                  상세
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && (
        <p className="p-6 text-center text-slate-500">등록된 학생이 없습니다.</p>
      )}
    </div>
  );
}
