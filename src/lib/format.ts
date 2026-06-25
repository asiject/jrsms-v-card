import { GRADE_LABELS, STAT_LABELS, WEEKS_PER_MONTH } from '@/game/constants';
import type { RequestGrade, StatKey } from '@/types/game';

export const formatMoney = (amount: number): string => {
  return `${amount.toLocaleString()}원`;
};

export const getTurnWeekLabel = (turn: number): string => {
  const month = Math.ceil(turn / WEEKS_PER_MONTH);
  const weekInMonth = ((turn - 1) % WEEKS_PER_MONTH) + 1;

  return `${turn}턴 · ${month}월 ${weekInMonth}주`;
};

export const getGradeLabel = (grade: RequestGrade): string => {
  return GRADE_LABELS[grade];
};

export const getStatLabel = (key: StatKey): string => {
  return STAT_LABELS[key];
};
