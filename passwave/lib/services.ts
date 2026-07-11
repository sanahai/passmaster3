export type ServiceColor = "rose" | "amber" | "indigo";

export type Service = {
  id: string;
  name: string;
  url: string;
  color: ServiceColor;
  certs: string;
  desc: string;
  logo: string;
};

export const SERVICES: Service[] = [
  {
    id: "beauty",
    name: "BEAUTYmaster",
    url: "https://beautymaster.kr",
    color: "rose",
    certs: "미용사·이용사",
    desc: "미용사(일반·피부·네일·메이크업)와 이용사 필기 시험 대비. AI 해설과 반복학습으로 합격까지.",
    logo: "/brands/beautymaster.png",
  },
  {
    id: "cook",
    name: "COOKmaster",
    url: "https://cookmaster.kr",
    color: "amber",
    certs: "조리기능사",
    desc: "한식·중식·양식·일식 조리기능사 필기 대비. 실전형 모의고사와 오답노트로 효율적으로 학습하세요.",
    logo: "/brands/cookmaster.png",
  },
  {
    id: "pass",
    name: "PASSmaster",
    url: "https://passmaster.kr",
    color: "indigo",
    certs: "전문·일반 자격증",
    desc: "지게차·전기 등 다양한 국가자격증 필기 대비. 분야별 맞춤 문제은행으로 빠르게 준비하세요.",
    logo: "/brands/passmaster.png",
  },
];

export const COLOR_STYLES: Record<
  ServiceColor,
  {
    gradient: string;
    badge: string;
    border: string;
    glow: string;
  }
> = {
  rose: {
    gradient: "from-rose-500 to-pink-500",
    badge: "bg-rose-50 text-rose-700",
    border: "border-rose-100 hover:border-rose-200",
    glow: "group-hover:shadow-rose-200/60",
  },
  amber: {
    gradient: "from-amber-500 to-orange-500",
    badge: "bg-amber-50 text-amber-700",
    border: "border-amber-100 hover:border-amber-200",
    glow: "group-hover:shadow-amber-200/60",
  },
  indigo: {
    gradient: "from-indigo-500 to-violet-500",
    badge: "bg-indigo-50 text-indigo-700",
    border: "border-indigo-100 hover:border-indigo-200",
    glow: "group-hover:shadow-indigo-200/60",
  },
};
