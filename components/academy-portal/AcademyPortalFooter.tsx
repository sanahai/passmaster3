import Link from "next/link";
import type { AcademyPortal } from "@/lib/academy-portal";

export default function AcademyPortalFooter({ academy }: { academy: AcademyPortal }) {
  return (
    <footer className="border-t border-b2b-border bg-b2b-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-lg font-bold">{academy.name}</p>
            <p className="mt-1 text-sm text-slate-400">BEAUTYmaster 제휴학원</p>
            {academy.code && (
              <p className="mt-2 text-sm text-slate-300">
                학원 코드: <span className="font-mono font-bold text-b2b-accent">{academy.code}</span>
              </p>
            )}
          </div>
          <div className="text-sm text-slate-400">
            <p>문의: support@beautymaster.kr</p>
            <Link href="/policy" className="mt-2 inline-block hover:text-white">
              이용약관
            </Link>
          </div>
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          Powered by BEAUTYmaster · 골든웨이브
        </p>
      </div>
    </footer>
  );
}
