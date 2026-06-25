import { useMemo, useState } from 'react';

import { LOG_CATEGORY_LABELS } from '@/game/constants';
import type { GameState, LogCategory } from '@/types/game';

interface LogPanelProps {
  state: GameState;
}

type LogFilter = LogCategory | 'all';

export const LogPanel = ({ state }: LogPanelProps) => {
  const [filter, setFilter] = useState<LogFilter>('all');

  const filteredLogs = useMemo(() => {
    const allEntries = [...state.turnLogs]
      .reverse()
      .flatMap((turnLog) => {
        return turnLog.entries.map((entry) => ({
          ...entry,
          turn: turnLog.turn,
          weekLabel: turnLog.weekLabel,
        }));
      });

    if (filter === 'all') {
      return allEntries;
    }

    return allEntries.filter((entry) => entry.category === filter);
  }, [filter, state.turnLogs]);

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-100">턴 로그</h2>
        <select
          className="rounded-md border border-slate-600 bg-slate-950 px-2 py-1 text-sm text-slate-200"
          value={filter}
          aria-label="로그 카테고리 필터"
          onChange={(event) => {
            setFilter(event.target.value as LogFilter);
          }}
        >
          {Object.entries(LOG_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
        {filteredLogs.length === 0 ? (
          <li className="text-slate-400">표시할 로그가 없습니다.</li>
        ) : (
          filteredLogs.map((entry) => (
            <li
              key={entry.id}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-300"
            >
              <p className="text-xs text-slate-500">
                {entry.weekLabel} · {LOG_CATEGORY_LABELS[entry.category]}
              </p>
              <p className="mt-1 text-slate-200">{entry.message}</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
};
