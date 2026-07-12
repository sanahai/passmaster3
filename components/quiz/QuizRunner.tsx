"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import TimerGauge from "./TimerGauge";
import OptionButton, { type OptionStatus } from "./OptionButton";
import ExplanationBox from "./ExplanationBox";
import ReportButton from "./ReportButton";
import type { QuizQuestion, QuizResult, SessionType, WrongItem } from "@/lib/types";
import {
  displayAnswerNumber,
  formatExplanationForDisplay,
} from "@/lib/explanation-display";

type Props = {
  questions: QuizQuestion[];
  sessionType: SessionType;
  courseSlug: string;
  timerSeconds: number | null;
  revealMode: boolean; // round1: 정답·해설 즉시 표시
  resultPath: string;
  title: string;
  mockNumber?: number;
  callComplete?: boolean;
  alwaysRecord?: boolean;
  hideReport?: boolean;
  answerApi?: string;
};

export const RESULT_KEY = "bm_result";

type AnswerRecord = { selected: number | null; revealed: boolean; timeSpent: number };

export default function QuizRunner({
  questions,
  sessionType,
  courseSlug,
  timerSeconds,
  revealMode,
  resultPath,
  title,
  mockNumber,
  callComplete = true,
  alwaysRecord = false,
  hideReport = false,
  answerApi = "/api/learn/answer",
}: Props) {
  const router = useRouter();
  const total = questions.length;

  // 이어하기 저장 키 (과정/세션/회차별)
  const storageKey = useMemo(
    () => `bm_quiz_${courseSlug}_${sessionType}_${mockNumber ?? 0}`,
    [courseSlug, sessionType, mockNumber]
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(AnswerRecord | null)[]>(() =>
    Array(total).fill(null)
  );
  const [seconds, setSeconds] = useState(timerSeconds ?? 0);
  const [finishing, setFinishing] = useState(false);
  const [restored, setRestored] = useState(false);

  const startRef = useRef<number>(Date.now());
  const recordedRef = useRef<Set<number>>(new Set());
  const finishingRef = useRef(false);

  const q = questions[index];
  const cur = answers[index] ?? null;
  const revealed = revealMode || (cur?.revealed ?? false);
  const selected = cur?.selected ?? null;

  // 마운트 시 localStorage 에서 진행 상태 복원 (문제 수가 동일할 때만)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as {
          total: number;
          index: number;
          answers: (AnswerRecord | null)[];
        };
        if (saved.total === total && Array.isArray(saved.answers)) {
          setAnswers(saved.answers);
          setIndex(Math.min(Math.max(0, saved.index), total - 1));
          saved.answers.forEach((a, i) => {
            if (a?.revealed) recordedRef.current.add(i);
          });
          setRestored(true);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recordAnswer = useCallback(
    (idx: number, sel: number | null, isCorrect: boolean, timeSpent: number) => {
      if (revealMode && !alwaysRecord) return;
      if (recordedRef.current.has(idx)) return;
      recordedRef.current.add(idx);
      const target = questions[idx];
      fetch(answerApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: target.id,
          sessionType,
          selected: sel,
          isCorrect,
          timeSpent,
          shuffledOrder: target.shuffledOrder,
          mockNumber,
        }),
      }).catch(() => {});
    },
    [questions, sessionType, mockNumber, revealMode, alwaysRecord, answerApi]
  );

  const setAnswerAt = useCallback((idx: number, rec: AnswerRecord) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = rec;
      return next;
    });
  }, []);

  const handleSelect = (originalIndex: number) => {
    if (revealMode || revealed) return;
    const timeSpent = Math.round((Date.now() - startRef.current) / 1000);
    const isCorrect = originalIndex === q.answer;
    setAnswerAt(index, { selected: originalIndex, revealed: true, timeSpent });
    recordAnswer(index, originalIndex, isCorrect, timeSpent);
  };

  const handleTimeout = useCallback(() => {
    if (revealMode || answers[index]?.revealed) return;
    const timeSpent = timerSeconds ?? 0;
    setAnswerAt(index, { selected: null, revealed: true, timeSpent });
    recordAnswer(index, null, false, timeSpent);
  }, [revealMode, answers, index, timerSeconds, setAnswerAt, recordAnswer]);

  // 타이머 (미응답 문제에서만 동작)
  useEffect(() => {
    if (timerSeconds === null || revealed) return;
    if (seconds <= 0) {
      handleTimeout();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, revealed, timerSeconds, handleTimeout]);

  // 문제 이동 시 타이머/시작시각 초기화
  useEffect(() => {
    setSeconds(timerSeconds ?? 0);
    startRef.current = Date.now();
  }, [index, timerSeconds]);

  // 자동 저장 (모든 답변/이동마다 localStorage 에 기록)
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ total, index, answers }));
    } catch {}
  }, [storageKey, total, index, answers]);

  // 서버 진행 위치 저장 (회차/모의고사 진행률 연동)
  const saveServerProgress = useCallback(
    (useBeacon = false) => {
      // 무료체험은 과정 학습 진행률에 반영하지 않음
      if (sessionType === "trial" || !courseSlug) return;

      const roundNum = sessionType.startsWith("round") ? Number(sessionType.slice(5)) : 0;
      // 현재 진행 중인 단계 키 (학습 홈의 단계 키와 동일)
      const curStepKey = sessionType === "mock" ? `mock${mockNumber}` : sessionType;
      const answered = answers.filter((a) => a?.revealed).length;
      const curStepPct = total > 0 ? Math.round((answered / total) * 100) : 0;

      const payload = JSON.stringify({
        courseSlug,
        lastQIndex: index,
        lastRound: roundNum || undefined,
        lastMock: sessionType === "mock" ? mockNumber : undefined,
        curStepKey,
        curStepPct,
      });
      try {
        if (useBeacon && navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/learn/progress",
            new Blob([payload], { type: "application/json" })
          );
        } else {
          fetch("/api/learn/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
    },
    [courseSlug, index, sessionType, mockNumber, answers, total]
  );

  // 진행 중 지속 저장: 문제 이동/답변 시마다 서버에 반영 (디바운스)
  useEffect(() => {
    const answered = answers.filter((a) => a?.revealed).length;
    if (answered === 0 && index === 0) return; // 시작 직후 빈 상태는 스킵
    const t = setTimeout(() => saveServerProgress(false), 800);
    return () => clearTimeout(t);
  }, [index, answers, saveServerProgress]);

  // 탭 닫기/새로고침 대비 (beacon)
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") saveServerProgress(true);
    };
    const onPageHide = () => saveServerProgress(true);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [saveServerProgress]);

  // SPA 네비게이션(나가기 Link 등)으로 언마운트될 때 마지막 상태 flush.
  // pagehide 는 SPA 이동에서 발생하지 않으므로 언마운트 시점에 저장한다.
  const saveRef = useRef(saveServerProgress);
  saveRef.current = saveServerProgress;
  useEffect(() => {
    return () => {
      // 완료(finish) 시에는 결과 페이지에서 서버가 처리하므로 중복 저장 생략
      if (!finishingRef.current) saveRef.current(false);
    };
  }, []);

  const finish = async () => {
    finishingRef.current = true;
    setFinishing(true);

    let correct = 0;
    let totalTime = 0;
    const perSubject: Record<string, { correct: number; total: number }> = {};
    const wrongList: WrongItem[] = [];

    if (!revealMode) {
      questions.forEach((question, i) => {
        const a = answers[i];
        if (!a) return;
        totalTime += a.timeSpent;
        const subj = question.subject || "기타";
        if (!perSubject[subj]) perSubject[subj] = { correct: 0, total: 0 };
        perSubject[subj].total += 1;
        const isCorrect = a.selected === question.answer;
        if (isCorrect) {
          correct += 1;
          perSubject[subj].correct += 1;
        } else {
          const correctOpt = question.options.find((o) => o.originalIndex === question.answer);
          const disp = displayAnswerNumber(question.options, question.answer);
          wrongList.push({
            id: question.id,
            subject: question.subject,
            content: question.content,
            correctText: `${disp}번. ${correctOpt?.text || ""}`,
            explanation: formatExplanationForDisplay(
              question.explanation,
              question.options,
              question.answer
            ),
          });
        }
      });
    }

    const result: QuizResult = {
      sessionType,
      courseSlug,
      mockNumber,
      total,
      correct,
      totalTime,
      perSubject,
      wrongList,
      passScore: sessionType === "mock" ? Math.ceil(total * 0.6) : undefined,
    };
    try {
      sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
    } catch {}

    // 완료했으므로 이어하기 저장 삭제
    try {
      localStorage.removeItem(storageKey);
    } catch {}

    if (callComplete) {
      try {
        await fetch("/api/learn/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseSlug,
            sessionType,
            mockNumber,
            score: sessionType === "mock" ? correct : undefined,
          }),
        });
      } catch {}
    }
    router.push(resultPath);
  };

  const next = () => {
    if (index + 1 >= total) {
      finish();
      return;
    }
    setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!q) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-beauty-gray">출제할 문제가 없습니다.</p>
      </div>
    );
  }

  const optionStatus = (originalIndex: number): OptionStatus => {
    if (revealMode) {
      return originalIndex === q.answer ? "correct" : "disabled";
    }
    if (!revealed) {
      return selected === originalIndex ? "selected" : "idle";
    }
    if (originalIndex === q.answer) return "correct";
    if (originalIndex === selected) return "wrong";
    return "disabled";
  };

  const isCorrectNow = revealMode ? null : revealed ? selected === q.answer : null;
  const displayExplanation = formatExplanationForDisplay(q.explanation, q.options, q.answer);
  const displayAnswer = displayAnswerNumber(q.options, q.answer);

  return (
    <div className="mx-auto max-w-2xl">
      {restored && (
        <div className="mb-3 rounded-card bg-primary-pale px-4 py-2 text-center text-sm font-semibold text-primary">
          💾 이전에 풀던 위치에서 이어서 시작합니다.
        </div>
      )}

      {/* 상단 바 */}
      <div className="mb-5 flex items-center gap-4">
        <div className="flex-1">
          <ProgressBar current={index + 1} total={total} subject={q.subject} />
        </div>
        {timerSeconds !== null && !revealMode && !revealed && (
          <TimerGauge seconds={seconds} total={timerSeconds} />
        )}
      </div>

      {/* 문제 카드 */}
      <div className="card animate-fade-in">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-primary">{title}</p>
          {!hideReport && <ReportButton questionId={q.id} />}
        </div>
        <h2 className="mb-5 text-lg font-bold leading-relaxed text-beauty-neutral">
          Q{index + 1}. {q.content}
        </h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <OptionButton
              key={i}
              number={i + 1}
              text={opt.text}
              status={optionStatus(opt.originalIndex)}
              onClick={() => handleSelect(opt.originalIndex)}
              disabled={revealed || revealMode}
            />
          ))}
        </div>

        {revealed && (
          <div className="mt-5">
            <ExplanationBox
              explanation={displayExplanation}
              isCorrect={isCorrectNow}
              aiAnalysis={q.aiAnalysis}
              selected={selected}
              displayAnswer={displayAnswer}
            />
          </div>
        )}

        {/* 이동 버튼 */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={prev}
            disabled={index === 0 || finishing}
            className="flex items-center justify-center gap-1 rounded-btn border border-gray-300 px-4 py-3 font-semibold text-beauty-gray transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden>←</span> 이전 문제
          </button>
          <button
            onClick={next}
            disabled={!revealed || finishing}
            className="btn-primary flex-1"
          >
            {finishing
              ? "결과 정리 중..."
              : index + 1 >= total
              ? "결과 보기"
              : "다음 문제"}
          </button>
        </div>
      </div>
    </div>
  );
}
