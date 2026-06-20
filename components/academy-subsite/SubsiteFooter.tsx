import type { BrandConfig } from "@/lib/brand";

type Props = {
  academyName: string;
  brand: BrandConfig;
};

export default function SubsiteFooter({ academyName, brand }: Props) {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500">
      <p>
        © {new Date().getFullYear()} {academyName} × {brand.name}
      </p>
      <p className="mt-1">
        문의: 학원 데스크 · 기술지원{" "}
        <a href="mailto:support@beautymaster.kr" className="text-[var(--subsite-primary)] hover:underline">
          support@beautymaster.kr
        </a>
      </p>
    </footer>
  );
}
