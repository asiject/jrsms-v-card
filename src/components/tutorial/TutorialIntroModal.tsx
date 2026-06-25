import { TUTORIAL_INTRO } from '@/game/data/tutorialContent';

interface TutorialIntroModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export const TutorialIntroModal = ({ isOpen, onConfirm }: TutorialIntroModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-intro-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-violet-700/50 bg-slate-900 p-6 shadow-2xl">
        <p className="text-xs font-medium uppercase tracking-widest text-violet-400">
          프롤로그 · 튜토리얼
        </p>
        <h2 id="tutorial-intro-title" className="mt-2 text-2xl font-bold text-slate-50">
          {TUTORIAL_INTRO.title}
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
          {TUTORIAL_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <button
          type="button"
          className="mt-6 w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500"
          onClick={onConfirm}
        >
          {TUTORIAL_INTRO.signLabel}
        </button>
      </div>
    </div>
  );
};
