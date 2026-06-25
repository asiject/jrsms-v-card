import { formatMoney, getTurnWeekLabel } from '@/lib/format';
import type { GameState } from '@/types/game';

interface StatusBarProps {
  state: GameState;
  onAdvanceTurn: () => void;
  onNewGame: () => void;
  onResetSave: () => void;
  onToggleNarrativeSpeed: () => void;
}

export const StatusBar = ({
  state,
  onAdvanceTurn,
  onNewGame,
  onResetSave,
  onToggleNarrativeSpeed,
}: StatusBarProps) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900/80 p-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">열혈 사무소 MVP</p>
        <h1 className="text-lg font-bold text-slate-50">{getTurnWeekLabel(state.turn)}</h1>
        <p className="text-sm text-slate-300">
          자금 {formatMoney(state.money)} · 사무소 Lv.{state.officeLevel} ·{' '}
          {state.playthrough}회차
        </p>
        {state.arrearsMonths > 0 && (
          <p className="text-sm text-rose-400">연체 {state.arrearsMonths}개월</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {state.playthrough >= 2 && (
          <button
            type="button"
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            onClick={onToggleNarrativeSpeed}
          >
            연출: {state.settings.narrativeSpeed === 'instant' ? '즉시' : '순차'}
          </button>
        )}
        <button
          type="button"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          onClick={onAdvanceTurn}
        >
          턴 종료
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          onClick={onNewGame}
        >
          새 회차
        </button>
        <button
          type="button"
          className="rounded-lg border border-rose-700 px-3 py-2 text-sm text-rose-300 hover:bg-rose-950"
          onClick={onResetSave}
        >
          초기화
        </button>
      </div>
    </header>
  );
};
