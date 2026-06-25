import { LogPanel } from '@/components/game/LogPanel';
import { RequestPanel } from '@/components/game/RequestPanel';
import { SchedulePanel } from '@/components/game/SchedulePanel';
import { StatusBar } from '@/components/game/StatusBar';
import { TurnSummaryModal } from '@/components/game/TurnSummaryModal';
import { useGameSession } from '@/hooks/useGameSession';

export const GameScreen = () => {
  const {
    state,
    selectedRequestId,
    isSummaryOpen,
    validationMessage,
    handleSelectRequest,
    handleAssignSchedule,
    handleAdvanceTurn,
    handleCloseSummary,
    handleNewGame,
    handleResetSave,
    handleToggleNarrativeSpeed,
  } = useGameSession();

  return (
    <div className="min-h-full bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 md:p-6">
        <StatusBar
          state={state}
          onAdvanceTurn={handleAdvanceTurn}
          onNewGame={handleNewGame}
          onResetSave={handleResetSave}
          onToggleNarrativeSpeed={handleToggleNarrativeSpeed}
        />

        {validationMessage !== null && (
          <p
            className="rounded-lg border border-rose-700 bg-rose-950/50 px-4 py-2 text-sm text-rose-200"
            role="alert"
          >
            {validationMessage}
          </p>
        )}

        <RequestPanel
          state={state}
          selectedRequestId={selectedRequestId}
          onSelectRequest={handleSelectRequest}
        />

        <SchedulePanel
          state={state}
          selectedRequestId={selectedRequestId}
          onAssignSchedule={handleAssignSchedule}
        />

        <LogPanel state={state} />

        <TurnSummaryModal
          isOpen={isSummaryOpen}
          weekLabel={state.turnLogs[state.turnLogs.length - 1]?.weekLabel ?? ''}
          summaryText={state.turnLogs[state.turnLogs.length - 1]?.summary ?? ''}
          isInstant={state.settings.narrativeSpeed === 'instant'}
          turnKey={state.turnLogs[state.turnLogs.length - 1]?.turn ?? 0}
          onClose={handleCloseSummary}
        />
      </div>
    </div>
  );
};
