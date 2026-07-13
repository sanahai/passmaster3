import Link from "next/link";
import { getBrand } from "@/lib/brand";

export default function AcademySubsiteNotFound() {
  const brand = getBrand();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-16 text-center">
      <p className="mb-2 text-5xl">🏫</p>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">학원 페이지를 찾을 수 없습니다</h1>
      <p className="mb-8 max-w-md text-slate-600">
        입력하신 URL에 해당하는 제휴학원이 없거나, 전용 주소(서브도메인)가 아직 설정되지 않았습니다.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-lg bg-[var(--subsite-primary,#236BFF)] px-5 py-2.5 text-sm font-bold text-white">
          {brand.name} 홈
        </Link>
        <Link href="/admin/academies" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700">
          학원 관리 (관리자)
        </Link>
        <Link href="/academy/dashboard" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700">
          B2B 대시보드
        </Link>
      </div>
      <p className="mt-10 text-xs text-slate-400">
        학원 원장이시면 B2B 설정에서「전용 페이지 URL」을 저장하세요.
      </p>
    </div>
  );
}
