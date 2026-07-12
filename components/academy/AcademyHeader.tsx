import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import PassmasterLogo from "@/components/PassmasterLogo";

type Props = {
  academyName: string;
  logoUrl?: string | null;
};

export default function AcademyHeader({ academyName, logoUrl }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-teal-900/40 bg-slate-900 px-6 py-3 text-white">
      <div className="flex items-center gap-3">
        <Link href="/academy/dashboard" className="flex items-center gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={academyName} className="h-8 max-w-[100px] object-contain" />
          ) : (
            <PassmasterLogo className="h-7 w-auto rounded bg-white/95 px-1" />
          )}
          <span className="hidden text-sm font-bold sm:inline">{academyName}</span>
        </Link>
        <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-xs font-bold text-teal-300">
          학원 관리자
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="hidden text-xs text-slate-400 hover:text-white sm:inline">
          메인 사이트
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-slate-400 hover:text-white">
            로그아웃
          </button>
        </form>
      </div>
    </header>
  );
}
