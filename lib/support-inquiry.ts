export const INQUIRY_CATEGORIES = [
  { value: "payment", label: "결제·환불" },
  { value: "learning", label: "수강·학습" },
  { value: "account", label: "계정·로그인" },
  { value: "other", label: "기타" },
] as const;

export const INQUIRY_STATUS: Record<
  string,
  { label: string; cls: string }
> = {
  pending: { label: "답변 대기", cls: "bg-primary-pale text-primary" },
  answered: { label: "답변 완료", cls: "bg-[#E8F5E9] text-beauty-success" },
  closed: { label: "종료", cls: "bg-gray-100 text-beauty-gray" },
};

export function inquiryCategoryLabel(value: string): string {
  return INQUIRY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
