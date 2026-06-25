import {
  MANAGER_INSIGHT_THRESHOLD,
  RECOMMENDED_COUNT_BY_OFFICE_LEVEL,
} from '@/game/constants';
import type {
  Manager,
  RecommendedStaff,
  RequestInstance,
  Staff,
} from '@/types/game';

const getManagerInsightScore = (manager: Manager): number => {
  return manager.stats.speech + manager.stats.social + manager.stats.creativity;
};

const buildMatchReasons = (
  staff: Staff,
  request: RequestInstance,
  showInsight: boolean,
): string[] => {
  if (!showInsight) {
    return [];
  }

  const reasons: string[] = [];
  const tagMatches = request.tags.filter((tag) => staff.tags.includes(tag));

  if (tagMatches.length > 0) {
    reasons.push(`태그 일치: ${tagMatches.join(', ')}`);
  }

  if (request.tags.some((tag) => tag === '협상') && staff.disposition === '협상가') {
    reasons.push('성향「협상가」적합');
  }

  if (request.tags.some((tag) => tag === '신체') && staff.disposition === '행동파') {
    reasons.push('성향「행동파」적합');
  }

  return reasons;
};

const calculateMatchScore = (
  staff: Staff,
  request: RequestInstance,
): number => {
  let score = 0;

  for (const [key, required] of Object.entries(request.requiredStats)) {
    const statKey = key as keyof Staff['stats'];
    score += staff.stats[statKey] - required;
  }

  for (const tag of request.tags) {
    if (staff.tags.includes(tag)) {
      score += 3;
    }
  }

  return score;
};

export const getRecommendedStaff = (
  staffList: Staff[],
  request: RequestInstance,
  officeLevel: number,
  manager: Manager,
): RecommendedStaff[] => {
  const count =
    RECOMMENDED_COUNT_BY_OFFICE_LEVEL[officeLevel] ??
    RECOMMENDED_COUNT_BY_OFFICE_LEVEL[1];
  const showInsight = getManagerInsightScore(manager) >= MANAGER_INSIGHT_THRESHOLD;

  return [...staffList]
    .map((staff) => ({
      staff,
      matchScore: calculateMatchScore(staff, request),
      reasons: buildMatchReasons(staff, request, showInsight),
    }))
    .sort((left, right) => right.matchScore - left.matchScore)
    .slice(0, count);
};

export const getRecommendedCount = (officeLevel: number): number => {
  return (
    RECOMMENDED_COUNT_BY_OFFICE_LEVEL[officeLevel] ??
    RECOMMENDED_COUNT_BY_OFFICE_LEVEL[1]
  );
};
