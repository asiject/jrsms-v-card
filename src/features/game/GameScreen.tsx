import { LogPanel } from '@/components/game/LogPanel';
import { RequestPanel } from '@/components/game/RequestPanel';
import { SchedulePanel } from '@/components/game/SchedulePanel';
import { StatusBar } from '@/components/game/StatusBar';
import { TurnSummaryModal } from '@/components/game/TurnSummaryModal';
import { TutorialEventModal } from '@/components/tutorial/TutorialEventModal';
import { TutorialGoalModal } from '@/components/tutorial/TutorialGoalModal';
import { TutorialGuidePanel } from '@/components/tutorial/TutorialGuidePanel';
import { TutorialIntroModal } from '@/components/tutorial/TutorialIntroModal';
import { useGameSession } from '@/hooks/useGameSession';

export const GameScreen = () => {
  const {
    state,
    selectedRequestId,
    isSummaryOpen,
    validationMessage,
    graduationMessage,
    handleSelectRequest,
    handleAssignSchedule,
    handleAdvanceTurn,
    handleCloseSummary,
    handleDismissIntro,
    handleEventChoice,
    handleGoalConfirm,
    handleNewGame,
    handleResetSave,
    handleToggleNarrativeSpeed,
  } = useGameSession();

  const isTutorialPlaying =
    state.tutorial.isActive && state.tutorial.phase === 'playing';
  const showMainPanels = state.tutorial.phase !== 'intro';

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

        {state.goals !== null && !state.tutorial.isActive && (
          <section className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 px-4 py-3 text-sm">
            <p className="text-emerald-300">
              <span className="font-medium">장기</span> {state.goals.longTermQuarterLabel}
            </p>
            <p className="mt-1 text-slate-300">
              <span className="font-medium text-emerald-400">단기</span>{' '}
              {state.goals.shortTermGoalLabel}
            </p>
          </section>
        )}

        {validationMessage !== null && (
          <p
            className="rounded-lg border border-rose-700 bg-rose-950/50 px-4 py-2 text-sm text-rose-200"
            role="alert"
          >
            {validationMessage}
          </p>
        )}

        {graduationMessage !== null && (
          <p className="rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-200">
            {graduationMessage}
          </p>
        )}

        {isTutorialPlaying && (
          <TutorialGuidePanel tutorialTurn={state.tutorial.tutorialTurn} />
        )}

        {showMainPanels && (
          <>
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
          </>
        )}

        <TurnSummaryModal
          isOpen={isSummaryOpen}
          weekLabel={state.turnLogs[state.turnLogs.length - 1]?.weekLabel ?? ''}
          summaryText={state.turnLogs[state.turnLogs.length - 1]?.summary ?? ''}
          isInstant={state.settings.narrativeSpeed === 'instant'}
          turnKey={state.turnLogs[state.turnLogs.length - 1]?.turn ?? 0}
          onClose={handleCloseSummary}
        />

        <TutorialIntroModal
          isOpen={state.tutorial.phase === 'intro'}
          onConfirm={handleDismissIntro}
        />

        <TutorialEventModal
          isOpen={state.tutorial.phase === 'event'}
          onSelectChoice={handleEventChoice}
        />

        <TutorialGoalModal
          isOpen={state.tutorial.phase === 'goal_setup'}
          onConfirm={handleGoalConfirm}
        />
      </div>
    </div>
  );
};
