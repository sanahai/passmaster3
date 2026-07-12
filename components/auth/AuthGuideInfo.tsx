type AuthGuideInfoProps = {
  variant: "login" | "signup";
};

export default function AuthGuideInfo({ variant }: AuthGuideInfoProps) {
  return (
    <div className="mt-6 w-full space-y-4 rounded-card border border-beauty-line bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-beauty-neutral">회원가입 및 로그인 안내</h2>
      <p className="text-sm text-beauty-gray">
        PASSmaster는 <strong className="text-beauty-neutral">이메일</strong>,{" "}
        <strong className="text-beauty-neutral">카카오</strong>,{" "}
        <strong className="text-beauty-neutral">구글</strong> 계정으로 가입·로그인할 수 있습니다.
      </p>

      {variant === "signup" ? (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-beauty-neutral">이메일 회원가입</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-beauty-gray">
            <li>이름, 이메일, 비밀번호(8자 이상·영문+숫자)를 입력합니다.</li>
            <li>연락처·학원 코드는 선택 입력입니다.</li>
            <li>가입 완료 후 무료체험 또는 수강신청을 진행할 수 있습니다.</li>
          </ul>
        </section>
      ) : (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-beauty-neutral">이메일 로그인</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-beauty-gray">
            <li>가입한 이메일과 비밀번호로 로그인합니다.</li>
            <li>「로그인 상태 유지」를 선택하면 7일간 세션이 유지됩니다.</li>
            <li>로그인 후 대시보드에서 학습 현황을 확인합니다.</li>
          </ul>
        </section>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold text-beauty-neutral">카카오 · 구글 로그인</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-beauty-gray">
          <li>카카오톡 또는 구글 계정으로 간편 가입·로그인이 가능합니다.</li>
          <li>소셜 로그인 후에도 동일하게 무료체험·수강신청을 이용할 수 있습니다.</li>
          <li>아래 카카오/구글 버튼을 선택해 주세요.</li>
        </ul>
      </section>
    </div>
  );
}
