import { SCHEDULE_LABELS } from '@/game/constants';
import type { GameState, RequestInstance, ScheduleType } from '@/types/game';

interface SchedulePanelProps {
  state: GameState;
  selectedRequestId: string | null;
  onAssignSchedule: (
    staffId: string,
    scheduleType: ScheduleType,
    requestInstanceId?: string,
  ) => void;
}

const SCHEDULE_OPTIONS: ScheduleType[] = ['wait', 'work', 'rest', 'growth'];

export const SchedulePanel = ({
  state,
  selectedRequestId,
  onAssignSchedule,
}: SchedulePanelProps) => {
  const getAssignedRequest = (requestId?: string): RequestInstance | undefined => {
    if (requestId === undefined) {
      return undefined;
    }

    return state.requests.find((request) => request.instanceId === requestId);
  };

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-100">스케줄 보드</h2>
        <span className="text-xs text-slate-400">인력(행) × 이번 주(열) · 탭·선택 MVP</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-slate-400">
              <th className="px-2 py-2">인력원</th>
              <th className="px-2 py-2">이번 주</th>
              <th className="px-2 py-2">배정 의뢰</th>
            </tr>
          </thead>
          <tbody>
            {state.staff.map((member) => {
              const assignment = state.assignments.find(
                (item) => item.staffId === member.id,
              );
              const scheduleType = assignment?.scheduleType ?? 'wait';
              const assignedRequest = getAssignedRequest(assignment?.requestInstanceId);

              return (
                <tr key={member.id} className="border-b border-slate-800">
                  <td className="px-2 py-3">
                    <p className="font-medium text-slate-100">{member.name}</p>
                    <p className="text-xs text-slate-400">{member.role}</p>
                  </td>
                  <td className="px-2 py-3">
                    <select
                      className="w-full rounded-md border border-slate-600 bg-slate-950 px-2 py-1 text-slate-100"
                      value={scheduleType}
                      aria-label={`${member.name} 스케줄 선택`}
                      onChange={(event) => {
                        const nextType = event.target.value as ScheduleType;
                        const requestId =
                          nextType === 'work' ? selectedRequestId ?? undefined : undefined;
                        onAssignSchedule(member.id, nextType, requestId);
                      }}
                    >
                      {SCHEDULE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {SCHEDULE_LABELS[option]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-3 text-slate-300">
                    {scheduleType === 'work' && assignedRequest !== undefined
                      ? assignedRequest.title
                      : scheduleType === 'work'
                        ? '의뢰를 선택하세요'
                        : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
