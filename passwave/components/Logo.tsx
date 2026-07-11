import { asset } from "@/lib/site";

export default function Logo({ className = "h-11" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset("/logo.png")}
      alt="PASSWAVE"
      className={`w-auto object-contain ${className}`}
    />
  );
}
