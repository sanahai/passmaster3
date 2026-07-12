import Image from "next/image";

type Props = {
  className?: string;
  priority?: boolean;
};

/** PASSmaster 공식 로고 — /public/logo.png */
export default function PassmasterLogo({ className = "h-9 w-auto", priority = false }: Props) {
  return (
    <Image
      src="/logo.png"
      alt="PASSmaster"
      width={320}
      height={120}
      priority={priority}
      className={className}
    />
  );
}
