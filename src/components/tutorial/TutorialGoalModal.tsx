import { useState } from 'react';

import {
  QUARTER_GOAL_LABEL,
  SHORT_TERM_GOAL_OPTIONS,
} from '@/game/data/tutorialContent';

interface TutorialGoalModalProps {
  isOpen: boolean;
  onConfirm: (shortTermGoalId: string) => void;
}

export const TutorialGoalModal = ({ isOpen, onConfirm }: TutorialGoalModalProps) => {
  const [selectedGoalId, setSelectedGoalId] = useState(SHORT_TERM_GOAL_OPTIONS[0].id);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-goal-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-emerald-700/50 bg-slate-900 p-5">
        <p className="text-xs uppercase tracking-wide text-emerald-400">목표 설정</p>
        <h2 id="tutorial-goal-title" className="mt-1 text-lg font-bold text-slate-50">
          본편 시작 전 목표를 정합니다
        </h2>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3">
          <p className="text-xs text-slate-400">장기 목표 (분기)</p>
          <p className="mt-1 text-sm font-medium text-slate-100">{QUARTER_GOAL_LABEL}</p>
        </div>
        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-medium text-slate-200">
            단기 목표 (이번 주) — 하나를 선택하세요
          </legend>
          <ul className="space-y-2">
            {SHORT_TERM_GOAL_OPTIONS.map((option) => (
              <li key={option.id}>
                <label
                  htmlFor={`short-term-goal-${option.id}`}
                  className="flex cursor-pointer gap-3 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 hover:border-emerald-600"
                >
                  <span className="sr-only">{option.label}</span>
                  <input
                    id={`short-term-goal-${option.id}`}
                    type="radio"
                    name="short-term-goal"
                    className="mt-1"
                    checked={selectedGoalId === option.id}
                    onChange={() => {
                      setSelectedGoalId(option.id);
                    }}
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-100">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">
                      {option.description}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <button
          type="button"
          className="mt-5 w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
          onClick={() => {
            onConfirm(selectedGoalId);
          }}
        >
          목표 확정 · 본편 시작
        </button>
      </div>
    </div>
  );
};
