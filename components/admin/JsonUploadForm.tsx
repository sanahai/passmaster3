"use client";

import { useFormState, useFormStatus } from "react-dom";
import { bulkUploadJsonAction } from "@/app/actions/admin";

type Course = { id: number; name: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "업로드 중..." : "JSON 파일 업로드"}
    </button>
  );
}

export default function JsonUploadForm({
  courses,
  forceFree = false,
}: {
  courses: Course[];
  forceFree?: boolean;
}) {
  const [state, formAction] = useFormState(bulkUploadJsonAction, undefined);

  return (
    <form action={formAction} className="card space-y-4">
      {forceFree && <input type="hidden" name="forceFree" value="1" />}
      {forceFree && (
        <p className="rounded-btn bg-[#E8F5E9] px-4 py-2 text-sm font-semibold text-beauty-success">
          🎁 업로드되는 모든 문제는 무료체험용(무료)으로 자동 등록됩니다.
        </p>
      )}
      <div>
        <label className="label">대상 과정</label>
        <select name="courseId" className="input" required>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">JSON 파일 선택 (.json)</label>
        <input
          type="file"
          name="file"
          accept=".json,application/json"
          required
          className="block w-full rounded-btn border border-gray-200 bg-white px-4 py-2.5 text-sm text-beauty-neutral file:mr-3 file:rounded-btn file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-primary-light"
        />
      </div>

      {state?.error && (
        <p className="rounded-btn bg-red-50 px-4 py-2 text-sm text-beauty-danger">{state.error}</p>
      )}
      {state?.count !== undefined && (
        <p className="rounded-btn bg-[#E8F5E9] px-4 py-2 text-sm font-semibold text-beauty-success">
          ✓ {state.count}개의 문제가 등록되었습니다.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
