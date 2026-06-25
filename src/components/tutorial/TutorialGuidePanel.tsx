import { DIRECTOR_NAME, DIRECTOR_TITLE, TUTORIAL_BEATS } from '@/game/data/tutorialContent';

interface TutorialGuidePanelProps {
  tutorialTurn: number;
}

export const TutorialGuidePanel = ({ tutorialTurn }: TutorialGuidePanelProps) => {
  const beat = TUTORIAL_BEATS[tutorialTurn];

  if (beat === undefined) {
    return null;
  }

  return (
    <section className="rounded-xl border border-violet-700/40 bg-violet-950/30 p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded bg-violet-800 px-2 py-0.5 text-xs font-medium text-violet-100">
          튜토리얼 {tutorialTurn}/4
        </span>
        <span className="text-xs text-violet-300">
          {DIRECTOR_TITLE} {DIRECTOR_NAME}
        </span>
      </div>
      <h2 className="text-base font-semibold text-violet-100">{beat.title}</h2>
      <div className="mt-2 space-y-2 text-sm text-slate-300">
        {beat.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p className="mt-3 rounded-lg border border-violet-600/40 bg-slate-950/60 px-3 py-2 text-sm font-medium text-emerald-300">
        ▶ {beat.objective}
      </p>
    </section>
  );
};
