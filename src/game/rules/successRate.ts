import type { RequestInstance, Staff, Stats } from '@/types/game';

const MIN_SUCCESS_RATE = 5;
const MAX_SUCCESS_RATE = 95;

/** 요구 스탯 대비 인력 능력치로 성공률(%) 산출 */
export const calculateSuccessRate = (
  staff: Staff,
  request: RequestInstance,
): number => {
  const requiredEntries = Object.entries(request.requiredStats);

  if (requiredEntries.length === 0) {
    return 50;
  }

  let totalGap = 0;

  for (const [key, requiredValue] of requiredEntries) {
    const statKey = key as keyof Stats;
    const staffValue = staff.stats[statKey];
    totalGap += staffValue - requiredValue;
  }

  const averageGap = totalGap / requiredEntries.length;
  const difficultyPenalty = (request.difficulty - 1) * 4;
  const rawRate = 55 + averageGap * 3 - difficultyPenalty;

  return Math.round(
    Math.min(MAX_SUCCESS_RATE, Math.max(MIN_SUCCESS_RATE, rawRate)),
  );
};

export const rollRequestSuccess = (successRate: number): boolean => {
  return Math.random() * 100 < successRate;
};
