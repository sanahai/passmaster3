export type QuizOption = {
  text: string;
  originalIndex: number; // 1~4 (원본 보기 번호)
};

// 오답분석 타입 (DB의 aiAnalysis JSON 구조)
export type Misconception = {
  concept_gap?: string;
  correct_concept?: string;
  remediation_tip?: string;
  remediation_topic?: string;
  misconception_weight?: number;
};

export type AiAnalysis = {
  key_concept?: string;
  study_reference?: string;
  learning_objective?: string;
  misconception_map?: Record<string, Misconception>;
};

export type QuizQuestion = {
  id: number;
  subject: string | null;
  content: string;
  explanation: string | null;
  options: QuizOption[];
  answer: number; // 정답의 originalIndex (1~4)
  shuffledOrder: string;
  aiAnalysis?: AiAnalysis | null; // ★ AI 오답분석 (misconception_map 포함)
};

export type SessionType =
  | "trial"
  | "round1"
  | "round2"
  | "round3"
  | "wrong_round"
  | "wrong_mock"
  | "mock"
  | "academy";

export type WrongItem = {
  id: number;
  subject: string | null;
  content: string;
  correctText: string;
  explanation: string | null;
};

export type QuizResult = {
  sessionType: SessionType;
  courseSlug: string;
  mockNumber?: number;
  total: number;
  correct: number;
  totalTime: number;
  perSubject: Record<string, { correct: number; total: number }>;
  wrongList: WrongItem[];
  passScore?: number; // 모의고사 합격선 (점수)
};
