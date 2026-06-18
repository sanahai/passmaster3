"use client";

export default function AcademyCodeCard({ code }: { code: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-b2b-section p-4">
      <div>
        <p className="mb-1 text-xs text-slate-500">학원 가입 코드</p>
        <p className="text-2xl font-bold tracking-widest text-b2b-primary">{code}</p>
      </div>
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(code)}
        className="rounded-lg bg-b2b-accent px-4 py-2 text-sm font-semibold text-white hover:bg-[#B01570]"
      >
        코드 복사
      </button>
    </div>
  );
}
