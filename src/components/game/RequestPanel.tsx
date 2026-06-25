import { getRecommendedStaff } from '@/game/rules/recommendation';
import { calculateSuccessRate } from '@/game/rules/successRate';
import { formatMoney, getGradeLabel, getStatLabel } from '@/lib/format';
import type { GameState, RequestInstance, StatKey } from '@/types/game';

interface RequestPanelProps {
  state: GameState;
  selectedRequestId: string | null;
  onSelectRequest: (requestId: string) => void;
}

const GRADE_STYLE: Record<RequestInstance['grade'], string> = {
  normal: 'bg-slate-700 text-slate-200',
  rare: 'bg-sky-900 text-sky-200',
  special: 'bg-violet-900 text-violet-200',
  important: 'bg-amber-900 text-amber-200',
};

export const RequestPanel = ({
  state,
  selectedRequestId,
  onSelectRequest,
}: RequestPanelProps) => {
  const selectedRequest = state.requests.find(
    (request) => request.instanceId === selectedRequestId,
  );

  const recommendations =
    selectedRequest !== undefined
      ? getRecommendedStaff(
          state.staff,
          selectedRequest,
          state.officeLevel,
          state.manager,
        )
      : [];

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
        <h2 className="mb-3 text-base font-semibold text-slate-100">의뢰 목록</h2>
        <ul className="space-y-2">
          {state.requests.map((request) => {
            const isSelected = request.instanceId === selectedRequestId;

            return (
              <li key={request.instanceId}>
                <button
                  type="button"
                  className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/40'
                      : 'border-slate-700 bg-slate-950 hover:border-slate-500'
                  }`}
                  onClick={() => {
                    onSelectRequest(request.instanceId);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${GRADE_STYLE[request.grade]}`}
                    >
                      {getGradeLabel(request.grade)}
                    </span>
                    <span className="font-medium text-slate-100">{request.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    보상 {formatMoney(request.reward)}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
        <h2 className="mb-3 text-base font-semibold text-slate-100">의뢰 상세</h2>
        {selectedRequest === undefined ? (
          <p className="text-sm text-slate-400">의뢰를 선택하면 상세가 표시됩니다.</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-lg font-semibold text-slate-50">{selectedRequest.title}</p>
              <p className="mt-1 text-slate-300">{selectedRequest.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedRequest.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1 font-medium text-slate-200">요구 능력치</p>
              <ul className="space-y-1 text-slate-300">
                {Object.entries(selectedRequest.requiredStats).map(([key, value]) => (
                  <li key={key}>
                    {getStatLabel(key as StatKey)} ≥ {value}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 font-medium text-slate-200">
                추천 인력 (사무소 Lv.{state.officeLevel})
              </p>
              <ul className="space-y-2">
                {recommendations.map((item) => {
                  const successRate = calculateSuccessRate(item.staff, selectedRequest);

                  return (
                    <li
                      key={item.staff.id}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-100">{item.staff.name}</span>
                        <span className="text-emerald-400">성공률 {successRate}%</span>
                      </div>
                      {item.reasons.length > 0 && (
                        <p className="mt-1 text-xs text-sky-300">
                          {item.reasons.join(' · ')}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
