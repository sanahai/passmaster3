import { shuffleOptions, serializeOrder, seededShuffle } from "./shuffle";
import type { QuizQuestion } from "./types";

type DbQuestion = {
  id: number;
  subject: string | null;
  content: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: number;
  explanation: string | null;
};

export type BuildQuizOptions = {
  /** false면 문항 순서를 섞지 않음 (모의고사 세션에 저장된 순서 유지) */
  shuffleOrder?: boolean;
  orderSeed?: number;
};

/** 회차·세션별 문항 순서 시드 (수강생·과정마다 다른 순서) */
export function quizOrderSeed(courseId: number, userId: number, sessionSeed: number): number {
  return courseId * 1_000_003 + userId * 1_007 + sessionSeed;
}

// DB 문제를 회차 시드 기반으로 보기를 셔플하여 클라이언트용으로 변환
export function buildQuizQuestions(
  questions: DbQuestion[],
  roundSeed: number,
  options: BuildQuizOptions = {}
): QuizQuestion[] {
  const shuffleOrder = options.shuffleOrder !== false;
  const orderSeed = options.orderSeed ?? roundSeed + 10_000;
  const ordered = shuffleOrder ? seededShuffle(questions, orderSeed) : questions;

  return ordered.map((q) => {
    const shuffled = shuffleOptions(
      [q.option1, q.option2, q.option3, q.option4],
      q.id,
      roundSeed
    );
    return {
      id: q.id,
      subject: q.subject,
      content: q.content,
      explanation: q.explanation,
      options: shuffled,
      answer: q.answer,
      shuffledOrder: serializeOrder(shuffled),
    };
  });
}

export const ROUND_SEED: Record<string, number> = {
  trial: 0,
  round1: 1,
  round2: 2,
  round3: 3,
  wrong_round: 4,
  wrong_mock: 5,
};
