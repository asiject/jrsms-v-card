import { TUTORIAL_EVENT } from '@/game/data/tutorialContent';

interface TutorialEventModalProps {
  isOpen: boolean;
  onSelectChoice: (choiceId: string) => void;
}

export const TutorialEventModal = ({ isOpen, onSelectChoice }: TutorialEventModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-event-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-amber-700/50 bg-slate-900 p-5">
        <p className="text-xs uppercase tracking-wide text-amber-400">돌발 이벤트</p>
        <h2 id="tutorial-event-title" className="mt-1 text-lg font-bold text-slate-50">
          {TUTORIAL_EVENT.title}
        </h2>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          {TUTORIAL_EVENT.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          {TUTORIAL_EVENT.choices.map((choice) => (
            <li key={choice.id}>
              <button
                type="button"
                className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-3 text-left hover:border-amber-500 hover:bg-amber-950/30"
                onClick={() => {
                  onSelectChoice(choice.id);
                }}
              >
                <p className="font-medium text-slate-100">{choice.label}</p>
                <p className="mt-1 text-xs text-slate-400">{choice.description}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
