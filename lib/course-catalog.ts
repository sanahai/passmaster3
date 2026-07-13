/** 랜딩·수강신청·무료체험 공통 노출 순서 */
export const COURSE_DISPLAY_ORDER = [
  "forklift", // 지게차운전기능사
  "electric", // 전기기능사
  "hansik", // 한식조리기능사
  "jegwa", // 제과기능사
  "jeppang", // 제빵기능사
  "beautician", // 미용사(일반)
  // 조리
  "yangsik",
  "ilsik",
  "jungsik",
  // 미용
  "skin",
  "nail",
  "makeup",
  // 이용사
  "baber",
] as const;

export const LANDING_CERTS = [
  { slug: "forklift", title: "지게차운전기능사", img: "/certs/forklift.png" },
  { slug: "electric", title: "전기기능사", img: "/certs/electric.png" },
  { slug: "hansik", title: "한식조리기능사", img: "/certs/cookkr.png" },
  { slug: "jegwa", title: "제과기능사", img: "/certs/confection.png" },
  { slug: "jeppang", title: "제빵기능사", img: "/certs/bakery.png" },
  { slug: "beautician", title: "미용사(일반)", img: "/certs/beautician.png" },
  { slug: "yangsik", title: "양식조리기능사", img: "/certs/cookwest.png" },
  { slug: "ilsik", title: "일식조리기능사", img: "/certs/cookjp.png" },
  { slug: "jungsik", title: "중식조리기능사", img: "/certs/cookcn.png" },
  { slug: "skin", title: "피부미용사", img: "/certs/skin.png" },
  { slug: "nail", title: "네일미용사", img: "/certs/nail.png" },
  { slug: "makeup", title: "메이크업미용사", img: "/certs/makeup.png" },
  { slug: "baber", title: "이용사", img: "/certs/barber.png" },
] as const;

const orderIndex = new Map<string, number>(
  COURSE_DISPLAY_ORDER.map((slug, index) => [slug, index])
);

export function courseDisplayOrderIndex(slug: string): number {
  return orderIndex.get(slug) ?? 999;
}

export function compareCourseDisplayOrder(a: { slug: string }, b: { slug: string }): number {
  const diff = courseDisplayOrderIndex(a.slug) - courseDisplayOrderIndex(b.slug);
  if (diff !== 0) return diff;
  return a.slug.localeCompare(b.slug);
}

export function sortByCourseDisplayOrder<T extends { slug: string }>(items: T[]): T[] {
  return [...items].sort(compareCourseDisplayOrder);
}
