import { STAT_KEYS, STAT_LABELS, WEEKS_PER_MONTH } from '@/game/constants';
import { calculateSuccessRate, rollRequestSuccess } from '@/game/rules/successRate';
import type {
  LogEntry,
  RequestInstance,
  Staff,
  StaffAssignment,
  TurnLog,
} from '@/types/game';

export const createLogId = (turn: number, index: number): string => {
  return `log-${turn}-${index}`;
};

export const getWeekLabel = (turn: number): string => {
  const month = Math.ceil(turn / WEEKS_PER_MONTH);
  const weekInMonth = ((turn - 1) % WEEKS_PER_MONTH) + 1;

  return `${month}개월차 ${weekInMonth}주`;
};

export const buildSummary = (entries: LogEntry[]): string => {
  const requestResults = entries.filter((entry) => entry.category === 'request');
  const economyResults = entries.filter((entry) => entry.category === 'economy');
  const staffResults = entries.filter((entry) => entry.category === 'staff');

  const lineOne =
    requestResults.length > 0
      ? requestResults
          .slice(0, 2)
          .map((entry) => entry.message)
          .join(' / ')
      : staffResults.length > 0
        ? staffResults[0].message
        : '이번 주는 사무소 정비에 집중했습니다';

  const lineTwo =
    economyResults.length > 0 ? economyResults[0].message : '재정 변동 없음';

  return `${lineOne}\n${lineTwo}`;
};

export const buildTurnLog = (turn: number, entries: LogEntry[]): TurnLog => {
  return {
    turn,
    weekLabel: getWeekLabel(turn),
    entries,
    summary: buildSummary(entries),
  };
};

export const applyGrowthEffect = (
  staff: Staff,
): { staff: Staff; message: string | null } => {
  if (Math.random() > 0.35) {
    return { staff, message: null };
  }

  const randomKey = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)];

  return {
    staff: {
      ...staff,
      stats: {
        ...staff.stats,
        [randomKey]: staff.stats[randomKey] + 1,
      },
    },
    message: `${staff.name} — ${STAT_LABELS[randomKey]} +1`,
  };
};

interface ProcessAssignmentResult {
  money: number;
  staffList: Staff[];
  entries: LogEntry[];
}

export const processStaffAssignment = (
  staff: Staff,
  assignment: StaffAssignment,
  requests: RequestInstance[],
  turn: number,
  money = 0,
): ProcessAssignmentResult => {
  const entries: LogEntry[] = [];
  let nextMoney = money;
  let nextStaff = staff;

  if (assignment.scheduleType === 'work' && assignment.requestInstanceId !== undefined) {
    const request = requests.find((item) => item.instanceId === assignment.requestInstanceId);

    if (request !== undefined) {
      const successRate = calculateSuccessRate(staff, request);
      const isSuccess = rollRequestSuccess(successRate);

      if (isSuccess) {
        nextMoney += request.reward;
        entries.push({
          id: createLogId(turn, entries.length),
          category: 'request',
          message: `${staff.name} — 「${request.title}」 성공 (+${request.reward.toLocaleString()}원, ${successRate}%)`,
        });
      } else {
        entries.push({
          id: createLogId(turn, entries.length),
          category: 'request',
          message: `${staff.name} — 「${request.title}」 실패 (${successRate}%)`,
        });
      }
    }
  }

  if (assignment.scheduleType === 'rest') {
    entries.push({
      id: createLogId(turn, entries.length),
      category: 'staff',
      message: `${staff.name} — 휴식으로 컨디션 회복`,
    });
  }

  if (assignment.scheduleType === 'growth') {
    const growthResult = applyGrowthEffect(staff);
    nextStaff = growthResult.staff;

    if (growthResult.message !== null) {
      entries.push({
        id: createLogId(turn, entries.length),
        category: 'staff',
        message: growthResult.message,
      });
    }
  }

  if (assignment.scheduleType === 'wait') {
    entries.push({
      id: createLogId(turn, entries.length),
      category: 'system',
      message: `${staff.name} — 의뢰 대기`,
    });
  }

  return {
    money: nextMoney,
    staffList: [nextStaff],
    entries,
  };
};
