"use client";

import { useState } from "react";
import { uploadCustomQuestionsAction } from "@/app/actions/academy";

export default function QuestionsUploadForm() {
  const [result, setResult] = useState<{ ok?: boolean; count?: number; error?: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setResult(null);
    const res = await uploadCustomQuestionsAction(formData);
    setResult(res ?? { error: "업로드 실패" });
    setPending(false);
  }

  return (
    <>
      <form action={handleSubmit} className="max-w-lg space-y-4 b2b-card">
        <input
          name="file"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="w-full text-sm"
          required
        />
        <button type="submit" disabled={pending} className="b2b-btn-accent w-full">
          {pending ? "업로드 중..." : "업로드"}
        </button>
      </form>

      {result?.error && <p className="mt-4 text-sm text-red-600">{result.error}</p>}
      {result?.ok && (
        <p className="mt-4 text-sm text-emerald-700">{result.count}개 문제가 등록되었습니다.</p>
      )}
    </>
  );
}
