import Link from "next/link";

export default function SocialLoginButtons({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const q = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "";

  return (
    <div className="space-y-3">
      <div className="relative py-1 text-center text-xs text-beauty-gray">
        <span className="bg-white px-2">또는</span>
        <div className="absolute inset-x-0 top-1/2 -z-10 border-t border-primary-pale" />
      </div>
      <Link
        href={`/api/auth/kakao${q}`}
        className="flex w-full items-center justify-center gap-2 rounded-btn bg-[#FEE500] px-4 py-2.5 text-sm font-semibold text-[#191600] hover:bg-[#f5d900]"
      >
        카카오로 계속하기
      </Link>
      <Link
        href={`/api/auth/google${q}`}
        className="flex w-full items-center justify-center gap-2 rounded-btn border border-primary-pale bg-white px-4 py-2.5 text-sm font-semibold text-beauty-neutral hover:border-primary hover:text-primary"
      >
        구글로 계속하기
      </Link>
      <p className="text-center text-xs text-beauty-gray">
        소셜 로그인은 카카오·구글 개발자 앱 연동 후 이용 가능합니다.
      </p>
    </div>
  );
}
