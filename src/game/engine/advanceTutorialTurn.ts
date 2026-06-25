import {
  QUARTER_GOAL_LABEL,
  SHORT_TERM_GOAL_OPTIONS,
  TUTORIAL_EVENT,
  TUTORIAL_STAFF_ID,
  createTutorialRequest,
} from '@/game/data/tutorialContent';
import { updateAssignment } from '@/game/engine/advanceTurn';
import { buildTurnLog, processStaffAssignment } from '@/game/engine/turnHelpers';
import { createMainGameState } from '@/game/models/createInitialState';
import { validateTutorialTurn } from '@/game/rules/tutorialValidation';
import type { GameState, GoalState, LogEntry, TurnAdvanceResult } from '@/types/game';

export { updateAssignment };

export const advanceTutorialTurn = (state: GameState): TurnAdvanceResult => {
  const tutorialError = validateTutorialTurn(state);

  if (tutorialError !== null) {
    return { ok: false, error: tutorialError };
  }

  const assignment = state.assignments.find((item) => item.staffId === TUTORIAL_STAFF_ID);

  if (assignment === undefined) {
    return { ok: false, error: '튜토리얼 인력원을 찾을 수 없습니다.' };
  }

  const staff = state.staff.find((member) => member.id === TUTORIAL_STAFF_ID);

  if (staff === undefined) {
    return { ok: false, error: '튜토리얼 인력원을 찾을 수 없습니다.' };
  }

  let money = state.money;
  let staffList = [...state.staff];
  let requests = [...state.requests];
  const entries: LogEntry[] = [];
  const { tutorialTurn } = state.tutorial;

  if (tutorialTurn === 1 && assignment.scheduleType === 'wait') {
    requests = [createTutorialRequest()];
    entries.push({
      id: `log-${state.turn}-0`,
      category: 'system',
      message: '한지우 — 의뢰 대기 중 「지상 세금 서류 정리」 의뢰 유입',
    });
  }

  if (tutorialTurn === 2 && assignment.scheduleType === 'work') {
    const request = requests.find((item) => item.instanceId === assignment.requestInstanceId);

    if (request !== undefined) {
      money += request.reward;
      requests = requests.filter((item) => item.instanceId !== request.instanceId);
      entries.push({
        id: `log-${state.turn}-0`,
        category: 'request',
        message: `${staff.name} — 「${request.title}」 성공 (+${request.reward.toLocaleString()}원, 튜토리얼)`,
      });
    }
  }

  if (tutorialTurn === 3 || tutorialTurn === 4) {
    const processResult = processStaffAssignment(
      staff,
      assignment,
      requests,
      state.turn,
      0,
    );

    staffList = staffList.map((member) => {
      if (member.id === staff.id) {
        return processResult.staffList[0];
      }

      return member;
    });
    entries.push(...processResult.entries);
  }

  const turnLog = buildTurnLog(state.turn, entries);
  const isLastTutorialTurn = tutorialTurn === 4;

  const nextState: GameState = {
    ...state,
    turn: isLastTutorialTurn ? state.turn : state.turn + 1,
    money,
    staff: staffList,
    requests,
    assignments: state.staff.map((member) => ({
      staffId: member.id,
      scheduleType: 'wait' as const,
    })),
    turnLogs: [...state.turnLogs, turnLog],
    lastSummary: turnLog.summary,
    tutorial: {
      ...state.tutorial,
      tutorialTurn: isLastTutorialTurn ? 4 : tutorialTurn + 1,
      phase: isLastTutorialTurn ? 'event' : 'playing',
    },
  };

  return {
    ok: true,
    state: nextState,
    summary: turnLog.summary,
  };
};

export const applyTutorialEventChoice = (
  state: GameState,
  choiceId: string,
): GameState => {
  const choice = TUTORIAL_EVENT.choices.find((item) => item.id === choiceId);

  if (choice === undefined) {
    return state;
  }

  const eventLog: LogEntry = {
    id: `log-event-${state.turn}`,
    category: 'system',
    message: choice.logMessage,
  };

  return {
    ...state,
    money: state.money + choice.moneyDelta,
    turnLogs: [
      ...state.turnLogs,
      {
        turn: state.turn,
        weekLabel: '튜토리얼 · 돌발',
        entries: [eventLog],
        summary: choice.logMessage,
      },
    ],
    tutorial: {
      ...state.tutorial,
      phase: 'goal_setup',
      eventChoiceId: choiceId,
    },
  };
};

export const completeTutorialGoals = (
  state: GameState,
  shortTermGoalId: string,
): GameState => {
  const shortTermGoal = SHORT_TERM_GOAL_OPTIONS.find((item) => item.id === shortTermGoalId);

  if (shortTermGoal === undefined) {
    return state;
  }

  const goals: GoalState = {
    longTermQuarterLabel: QUARTER_GOAL_LABEL,
    shortTermGoalId: shortTermGoal.id,
    shortTermGoalLabel: shortTermGoal.label,
  };

  const graduated = createMainGameState(state.playthrough, {
    money: state.money,
    staff: state.staff,
    turnLogs: state.turnLogs,
    goals,
    manager: state.manager,
    settings: state.settings,
  });

  return {
    ...graduated,
    tutorial: {
      isActive: false,
      completed: true,
      phase: 'complete',
      tutorialTurn: 4,
      eventChoiceId: state.tutorial.eventChoiceId,
    },
    goals,
  };
};

export const dismissTutorialIntro = (state: GameState): GameState => {
  return {
    ...state,
    tutorial: {
      ...state.tutorial,
      phase: 'playing',
    },
  };
};
