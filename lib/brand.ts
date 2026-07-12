/** passmaster / cookmaster / legacy beautymaster id — 배포별 NEXT_PUBLIC_BRAND 로 구분 */

export type BrandId = "beautymaster" | "cookmaster" | "passmaster";

export type BrandConfig = {
  id: BrandId;
  name: string;
  shortName: string;
  tagline: string;
  logo: string;
  primary: string;
  accent: string;
  studentAccent: string;
  adminBg: string;
  categoryLabel: string;
};

export const BRANDS: Record<BrandId, BrandConfig> = {
  beautymaster: {
    id: "beautymaster",
    name: "PASSmaster",
    shortName: "PASS",
    tagline: "국가기능사·자격증 필기 문제은행",
    logo: "/logo.png",
    primary: "#2563EB",
    accent: "#7C3AED",
    studentAccent: "#14B8A6",
    adminBg: "#0F172A",
    categoryLabel: "자격증",
  },
  cookmaster: {
    id: "cookmaster",
    name: "COOKmaster",
    shortName: "COOK",
    tagline: "조리·제과제빵 국가기능사 필기 문제은행",
    logo: "/brands/cookmaster.svg",
    primary: "#EA580C",
    accent: "#0D9488",
    studentAccent: "#22C55E",
    adminBg: "#1C1917",
    categoryLabel: "조리·제과",
  },
  passmaster: {
    id: "passmaster",
    name: "PASSmaster",
    shortName: "PASS",
    tagline: "국가기능사·자격증 필기 문제은행",
    logo: "/logo.png",
    primary: "#2563EB",
    accent: "#7C3AED",
    studentAccent: "#14B8A6",
    adminBg: "#0F172A",
    categoryLabel: "자격증",
  },
};

export function getBrand(override?: string | null): BrandConfig {
  const fromEnv = process.env.NEXT_PUBLIC_BRAND as BrandId | undefined;
  const id = (override || fromEnv || "passmaster") as BrandId;
  const resolved = id === "beautymaster" ? "passmaster" : id;
  return BRANDS[resolved] ?? BRANDS.passmaster;
}

export function brandForAcademy(academyBrand?: string | null): BrandConfig {
  return getBrand(academyBrand);
}
