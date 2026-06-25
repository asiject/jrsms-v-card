import { useEffect, useState } from 'react';

interface SummaryBodyProps {
  lines: string[];
  isInstant: boolean;
  weekLabel: string;
  onClose: () => void;
}

const SummaryBody = ({ lines, isInstant, weekLabel, onClose }: SummaryBodyProps) => {
  const [revealCount, setRevealCount] = useState(() => {
    return isInstant ? lines.length : 0;
  });

  useEffect(() => {
    if (isInstant) {
      return;
    }

    let index = 0;

    const timer = window.setInterval(() => {
      index += 1;
      setRevealCount(index);

      if (index >= lines.length) {
        window.clearInterval(timer);
      }
    }, 700);

    return () => {
      window.clearInterval(timer);
    };
  }, [isInstant, lines.length]);

  const visibleLines = lines.slice(0, revealCount);

  return (
    <div className="w-full max-w-lg rounded-xl border border-slate-600 bg-slate-900 p-5 shadow-xl">
      <h2 id="turn-summary-title" className="text-lg font-bold text-slate-50">
        {weekLabel} 결과
      </h2>
      <div className="mt-3 space-y-2 text-sm text-slate-200">
        {visibleLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <button
        type="button"
        className="mt-5 w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        onClick={onClose}
      >
        확인
      </button>
    </div>
  );
};

interface TurnSummaryModalProps {
  isOpen: boolean;
  weekLabel: string;
  summaryText: string;
  isInstant: boolean;
  turnKey: number;
  onClose: () => void;
}

export const TurnSummaryModal = ({
  isOpen,
  weekLabel,
  summaryText,
  isInstant,
  turnKey,
  onClose,
}: TurnSummaryModalProps) => {
  if (!isOpen) {
    return null;
  }

  const lines = summaryText.split('\n').filter((line) => line.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="turn-summary-title"
    >
      <SummaryBody
        key={`${turnKey}-${isInstant}`}
        lines={lines}
        isInstant={isInstant}
        weekLabel={weekLabel}
        onClose={onClose}
      />
    </div>
  );
};
