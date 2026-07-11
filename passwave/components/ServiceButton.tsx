import { asset } from "@/lib/site";
import type { Service } from "@/lib/services";

type Props = {
  service: Service;
  className?: string;
  size?: "md" | "lg" | "xl";
};

const HEIGHT = {
  md: "h-20 sm:h-24",
  lg: "h-24 sm:h-28 md:h-32",
  xl: "h-28 sm:h-36 md:h-44",
};

export default function ServiceButton({ service, className = "", size = "lg" }: Props) {
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex w-full items-center justify-center rounded-2xl border border-slate-100 bg-white px-8 py-6 shadow-md transition duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand md:rounded-3xl md:px-10 md:py-8 ${className}`}
      aria-label={`${service.name} 바로가기`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(service.logo)}
        alt={service.name}
        className={`${HEIGHT[size]} w-full max-w-[360px] object-contain object-center transition duration-300 group-hover:scale-[1.03] md:max-w-[420px]`}
      />
    </a>
  );
}
