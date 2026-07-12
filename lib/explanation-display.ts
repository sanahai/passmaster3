import type { QuizOption } from "./types";

const CIRCLED = ["①", "②", "③", "④"] as const;

/** 셔플된 화면에서 정답이 몇 번 보기인지 (1~4) */
export function displayAnswerNumber(
  options: Pick<QuizOption, "originalIndex">[],
  originalAnswer: number
): number {
  const idx = options.findIndex((o) => o.originalIndex === originalAnswer);
  return idx >= 0 ? idx + 1 : originalAnswer;
}

function originalToDisplayMap(options: Pick<QuizOption, "originalIndex">[]): Map<number, number> {
  const map = new Map<number, number>();
  options.forEach((opt, i) => map.set(opt.originalIndex, i + 1));
  return map;
}

function isShuffled(options: Pick<QuizOption, "originalIndex">[]): boolean {
  return options.some((opt, i) => opt.originalIndex !== i + 1);
}

/** DB 해설(원본 보기 번호)을 현재 화면 보기 번호에 맞게 변환 */
export function formatExplanationForDisplay(
  explanation: string | null,
  options: Pick<QuizOption, "originalIndex">[],
  originalAnswer: number
): string | null {
  if (!explanation || !isShuffled(options)) return explanation;

  const map = originalToDisplayMap(options);
  const displayAnswer = map.get(originalAnswer) ?? originalAnswer;
  let text = explanation;

  if (displayAnswer !== originalAnswer) {
    const orig = originalAnswer;
    const replacements: [RegExp, string][] = [
      [new RegExp(`정답은\\s*${orig}\\s*번`, "gi"), `정답은 ${displayAnswer}번`],
      [new RegExp(`정답\\s*[:：]\\s*${orig}\\s*번`, "gi"), `정답: ${displayAnswer}번`],
      [new RegExp(`${orig}\\s*번이\\s*정답`, "gi"), `${displayAnswer}번이 정답`],
      [new RegExp(`\\b${orig}번입니다`, "g"), `${displayAnswer}번입니다`],
    ];
    if (CIRCLED[orig - 1]) {
      replacements.push([
        new RegExp(`정답은\\s*${CIRCLED[orig - 1]}`, "g"),
        `정답은 ${displayAnswer}번`,
      ]);
    }
    for (const [re, repl] of replacements) {
      text = text.replace(re, repl);
    }
  }

  for (let orig = 1; orig <= 4; orig++) {
    const display = map.get(orig)!;
    if (display !== orig && CIRCLED[orig - 1]) {
      text = text.replaceAll(CIRCLED[orig - 1], `${display}번`);
    }
  }

  return text;
}
