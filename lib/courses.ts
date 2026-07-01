// 미용사 자격증 4종의 과목 구성 및 출제 비율 (스펙 Chapter 2)

export type SubjectRatio = { subject: string; ratio: number };

export type CourseConfig = {
  slug: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  price: number;
  subjects: SubjectRatio[];
  comingSoon?: boolean; // true면 메뉴/아이콘만 노출, 수강·학습은 차후 오픈
};

// 미용사 패키지(4종 전체)에 포함되는 카테고리
export const PACKAGE_CATEGORY = "미용사";

/** 단일 과정 1개월 이용 요금 */
export const MONTHLY_PRICE = 9900;
export const COURSE_DURATION_DAYS = 30;

export const COURSES: CourseConfig[] = [
  {
    slug: "beauty-general",
    name: "미용사(일반) 필기",
    category: "미용사",
    icon: "💇‍♀️",
    description: "미용이론·피부학·공중보건학·소독학·법규·화장품학",
    price: MONTHLY_PRICE,
    subjects: [
      { subject: "미용이론", ratio: 0.2 },
      { subject: "피부학", ratio: 0.2 },
      { subject: "공중보건학", ratio: 0.2 },
      { subject: "소독학", ratio: 0.15 },
      { subject: "미용관계법규", ratio: 0.15 },
      { subject: "화장품학", ratio: 0.1 },
    ],
  },
  {
    slug: "beauty-skin",
    name: "미용사(피부) 필기",
    category: "미용사",
    icon: "🧖‍♀️",
    description: "피부미용이론·피부학·해부생리학·화장품학·공중보건학·법규",
    price: MONTHLY_PRICE,
    subjects: [
      { subject: "피부미용이론", ratio: 0.3 },
      { subject: "피부학", ratio: 0.2 },
      { subject: "해부생리학", ratio: 0.15 },
      { subject: "화장품학", ratio: 0.1 },
      { subject: "공중보건학", ratio: 0.15 },
      { subject: "피부미용관계법규", ratio: 0.1 },
    ],
  },
  {
    slug: "beauty-nail",
    name: "미용사(네일) 필기",
    category: "미용사",
    icon: "💅",
    description: "네일개론·피부학·공중보건학·화장품학·법규",
    price: MONTHLY_PRICE,
    subjects: [
      { subject: "네일개론", ratio: 0.3 },
      { subject: "피부학", ratio: 0.2 },
      { subject: "공중보건학", ratio: 0.2 },
      { subject: "화장품학", ratio: 0.1 },
      { subject: "네일미용관계법규", ratio: 0.2 },
    ],
  },
  {
    slug: "beauty-makeup",
    name: "미용사(메이크업) 필기",
    category: "미용사",
    icon: "💄",
    description: "메이크업개론·피부학·공중보건학·화장품학·법규",
    price: MONTHLY_PRICE,
    subjects: [
      { subject: "메이크업개론", ratio: 0.3 },
      { subject: "피부학", ratio: 0.2 },
      { subject: "공중보건학", ratio: 0.2 },
      { subject: "화장품학", ratio: 0.1 },
      { subject: "메이크업관계법규", ratio: 0.2 },
    ],
  },
  {
    slug: "barber",
    name: "이용사 필기",
    category: "이용사",
    icon: "💈",
    description: "이용이론·피부학·공중보건학·소독학·법규·화장품학",
    price: MONTHLY_PRICE,
    subjects: [
      { subject: "이용이론", ratio: 0.25 },
      { subject: "피부학", ratio: 0.15 },
      { subject: "공중보건학", ratio: 0.2 },
      { subject: "소독학", ratio: 0.15 },
      { subject: "이용관계법규", ratio: 0.15 },
      { subject: "화장품학", ratio: 0.1 },
    ],
  },
  {
    slug: "tattoo",
    name: "문신사 필기",
    category: "문신사",
    icon: "🪡",
    description: "문신 시술 이론·위생·감염관리·관계법규 (준비 중)",
    price: MONTHLY_PRICE,
    comingSoon: true,
    subjects: [],
  },
];

export const PACKAGE_PRICE = MONTHLY_PRICE * 4;
export const EXTEND_PRICE = MONTHLY_PRICE;

export function getCourseConfig(slug: string): CourseConfig | undefined {
  return COURSES.find((c) => c.slug === slug);
}

// 모의고사 회차별 난이도 비율 (easy:normal:hard) (스펙 Chapter 4-6)
export const MOCK_CONFIG: Record<
  number,
  { name: string; difficulty: string; easy: number; normal: number; hard: number }
> = {
  1: { name: "쉬움", difficulty: "easy", easy: 0.7, normal: 0.2, hard: 0.1 },
  2: { name: "보통", difficulty: "normal", easy: 0.2, normal: 0.6, hard: 0.2 },
  3: { name: "어려움", difficulty: "hard", easy: 0.1, normal: 0.2, hard: 0.7 },
  4: { name: "실전1", difficulty: "real", easy: 0.25, normal: 0.5, hard: 0.25 },
  5: { name: "실전2", difficulty: "real", easy: 0.25, normal: 0.5, hard: 0.25 },
  6: { name: "실전3", difficulty: "real", easy: 0.25, normal: 0.5, hard: 0.25 },
};
