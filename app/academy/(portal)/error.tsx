"use client";

import Link from "next/link";

export default function AcademyPortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="mb-2 text-xl font-bold text-b2b-primary">학원 대시보드를 불러오지 못했습니다</h1>
      <p className="mb-4 text-sm text-slate-600">
        일시적 오류이거나 DB 스키마가 아직 반영되지 않았을 수 있습니다.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="mb-4 overflow-x-auto rounded-lg bg-red-50 p-3 text-left text-xs text-red-800">
          {error.message}
        </pre>
      )}
      <div className="flex justify-center gap-3">
        <button type="button" onClick={reset} className="b2b-btn-accent">
          다시 시도
        </button>
        <Link href="/dashboard" className="rounded-lg border border-b2b-border px-4 py-2 text-sm font-semibold">
          일반 대시보드
        </Link>
      </div>
      {error.digest && (
        <p className="mt-4 text-xs text-slate-400">Digest: {error.digest}</p>
      )}
    </div>
  );
}
