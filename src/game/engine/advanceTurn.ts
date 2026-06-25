import { economyBalance } from '@/game/data/loadBalance';
import { advanceTutorialTurn } from '@/game/engine/advanceTutorialTurn';
import { fillRequestPool } from '@/game/models/createInitialState';
import {
  applyGrowthEffect,
  buildSummary,
  buildTurnLog,
  createLogId,
} from '@/game/engine/turnHelpers';
import { calculateSuccessRate, rollRequestSuccess } from '@/game/rules/successRate';
import { WEEKS_PER_MONTH } from '@/game/constants';
import type {
  GameState,
  LogEntry,
  StaffAssignment,
  TurnAdvanceResult,
  TurnLog,
} from '@/types/game';

const processMonthlyBilling = (
  state: GameState,
  entries: LogEntry[],
  turn: number,
): GameState => {
  const monthlyCost =
    economyBalance.monthlyRent +
    economyBalance.monthlyUtilities +
    economyBalance.monthlySalaryPerStaff * state.staff.length;

  const money = state.money - monthlyCost;
  let arrearsMonths = state.arrearsMonths;
  let message = `월간 고정비 -${monthlyCost.toLocaleString()}원`;

  if (money < 0) {
    arrearsMonths += 1;
    message += ` (연체 ${arrearsMonths}개월)`;
  } else {
    arrearsMonths = 0;
  }

  entries.push({
    id: createLogId(turn, entries.length),
    category: 'economy',
    message,
  });

  return {
    ...state,
    money,
    arrearsMonths,
  };
};

const validateAssignments = (assignments: StaffAssignment[]): string | null => {
  for (const assignment of assignments) {
    if (assignment.scheduleType === 'work' && assignment.requestInstanceId === undefined) {
      return '의뢰 수행을 선택한 인력에게 의뢰를 배정해 주세요.';
    }
  }

  const workTargets = assignments
    .filter((assignment) => assignment.scheduleType === 'work')
    .map((assignment) => assignment.requestInstanceId);

  const uniqueTargets = new Set(workTargets);

  if (uniqueTargets.size !== workTargets.length) {
    return '동일 의뢰에 중복 배정된 인력이 있습니다.';
  }

  return null;
};

export const advanceTurn = (state: GameState): TurnAdvanceResult => {
  if (state.tutorial.isActive && state.tutorial.phase === 'playing') {
    return advanceTutorialTurn(state);
  }

  const validationError = validateAssignments(state.assignments);

  if (validationError !== null) {
    return {
      ok: false,
      error: validationError,
    };
  }

  const entries: LogEntry[] = [];
  let money = state.money;
  const staffList = [...state.staff];
  let requests = [...state.requests];
  const completedRequestIds = new Set<string>();

  for (const assignment of state.assignments) {
    const staffIndex = staffList.findIndex((member) => member.id === assignment.staffId);

    if (staffIndex === -1) {
      continue;
    }

    const staff = staffList[staffIndex];

    if (assignment.scheduleType === 'work' && assignment.requestInstanceId !== undefined) {
      const request = requests.find(
        (item) => item.instanceId === assignment.requestInstanceId,
      );

      if (request === undefined) {
        continue;
      }

      const successRate = calculateSuccessRate(staff, request);
      const isSuccess = rollRequestSuccess(successRate);

      if (isSuccess) {
        money += request.reward;
        completedRequestIds.add(request.instanceId);
        entries.push({
          id: createLogId(state.turn, entries.length),
          category: 'request',
          message: `${staff.name} — 「${request.title}」 성공 (+${request.reward.toLocaleString()}원, ${successRate}%)`,
        });
      } else {
        entries.push({
          id: createLogId(state.turn, entries.length),
          category: 'request',
          message: `${staff.name} — 「${request.title}」 실패 (${successRate}%)`,
        });
      }
    }

    if (assignment.scheduleType === 'rest') {
      entries.push({
        id: createLogId(state.turn, entries.length),
        category: 'staff',
        message: `${staff.name} — 휴식으로 컨디션 회복`,
      });
    }

    if (assignment.scheduleType === 'growth') {
      const growthResult = applyGrowthEffect(staff);
      staffList[staffIndex] = growthResult.staff;

      if (growthResult.message !== null) {
        entries.push({
          id: createLogId(state.turn, entries.length),
          category: 'staff',
          message: growthResult.message,
        });
      }
    }

    if (assignment.scheduleType === 'wait') {
      entries.push({
        id: createLogId(state.turn, entries.length),
        category: 'system',
        message: `${staff.name} — 의뢰 대기`,
      });
    }
  }

  requests = requests.filter((request) => !completedRequestIds.has(request.instanceId));

  const nextTurn = state.turn + 1;
  requests = fillRequestPool(requests, economyBalance.requestPoolSize, nextTurn);

  const turnLog: TurnLog = buildTurnLog(state.turn, entries);

  let nextState: GameState = {
    ...state,
    turn: nextTurn,
    money,
    staff: staffList,
    requests,
    assignments: state.staff.map((member) => ({
      staffId: member.id,
      scheduleType: 'wait' as const,
    })),
    turnLogs: [...state.turnLogs, turnLog],
    lastSummary: turnLog.summary,
  };

  if (state.turn % WEEKS_PER_MONTH === 0) {
    nextState = processMonthlyBilling(nextState, entries, state.turn);
    turnLog.summary = buildSummary(entries);
    nextState = {
      ...nextState,
      lastSummary: turnLog.summary,
      turnLogs: [...nextState.turnLogs.slice(0, -1), turnLog],
    };
  }

  if (nextState.arrearsMonths >= 12) {
    entries.push({
      id: createLogId(state.turn, entries.length),
      category: 'system',
      message: '12개월 연체 — 패배 엔딩 (MVP 알림)',
    });
    turnLog.summary = buildSummary(entries);
    nextState = {
      ...nextState,
      lastSummary: turnLog.summary,
      turnLogs: [...nextState.turnLogs.slice(0, -1), turnLog],
    };
  }

  return {
    ok: true,
    state: nextState,
    summary: turnLog.summary,
  };
};

export const updateAssignment = (
  state: GameState,
  staffId: string,
  scheduleType: StaffAssignment['scheduleType'],
  requestInstanceId?: string,
): GameState => {
  return {
    ...state,
    assignments: state.assignments.map((assignment) => {
      if (assignment.staffId !== staffId) {
        return assignment;
      }

      return {
        staffId,
        scheduleType,
        requestInstanceId:
          scheduleType === 'work' ? requestInstanceId : undefined,
      };
    }),
  };
};
