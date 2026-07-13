/** 선택지 문장 맨 앞의 보기 번호(1)~4), (1), ① 등) 제거 — UI가 1~4번을 별도 표시 */
const CHOICE_PREFIX =
  /^[\s]*(?:(?:(?:\(|\uFF08)\s*)?[1-4]\s*(?:\)|\uFF09)|[\u2460-\u2463])\s*/;

export function stripChoiceNumberPrefix(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const stripped = trimmed.replace(CHOICE_PREFIX, "").trim();
  return stripped || trimmed;
}

export function normalizeChoiceTexts(
  options: [string, string, string, string]
): [string, string, string, string] {
  return options.map((opt) => stripChoiceNumberPrefix(opt)) as [
    string,
    string,
    string,
    string,
  ];
}
