/** beautymaster / cookmaster / passmaster — 배포별 NEXT_PUBLIC_BRAND 로 구분 */

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
    name: "BEAUTYmaster",
    shortName: "BEAUTY",
    tagline: "미용사 국가기능사 필기 문제은행",
    logo: "/logo.png",
    primary: "#D81B60",
    accent: "#0EA5E9",
    studentAccent: "#10B981",
    adminBg: "#0F172A",
    categoryLabel: "미용사",
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
    logo: "/brands/passmaster.svg",
    primary: "#2563EB",
    accent: "#7C3AED",
    studentAccent: "#14B8A6",
    adminBg: "#0F172A",
    categoryLabel: "자격증",
  },
};

export function getBrand(override?: string | null): BrandConfig {
  const fromEnv = process.env.NEXT_PUBLIC_BRAND as BrandId | undefined;
  const id = (override || fromEnv || "beautymaster") as BrandId;
  return BRANDS[id] ?? BRANDS.beautymaster;
}

export function brandForAcademy(academyBrand?: string | null): BrandConfig {
  return getBrand(academyBrand);
}
