export const SCHEMA_VERSION = 2;

export const STAT_KEYS = [
  'physical',
  'speech',
  'creativity',
  'charm',
  'social',
  'mental',
] as const;

export type StatKey = (typeof STAT_KEYS)[number];

export const STAT_LABELS: Record<StatKey, string> = {
  physical: '피지컬',
  speech: '입담',
  creativity: '창의성',
  charm: '매력도',
  social: '사교성',
  mental: '멘탈',
};

export const GRADE_LABELS = {
  normal: '일반',
  rare: '희귀',
  special: '특별',
  important: '중요',
} as const;

export const SCHEDULE_LABELS = {
  wait: '의뢰 대기',
  work: '의뢰 수행',
  rest: '휴식',
  growth: '성장',
} as const;

export const LOG_CATEGORY_LABELS = {
  all: '전체',
  request: '의뢰',
  economy: '재정',
  staff: '인력',
  system: '시스템',
} as const;

export const WEEKS_PER_MONTH = 4;

export const SAVE_STORAGE_KEY = 'jrsms-v-card-save';

export const RECOMMENDED_COUNT_BY_OFFICE_LEVEL: Record<number, number> = {
  1: 2,
  2: 3,
  3: 4,
};

export const MANAGER_INSIGHT_THRESHOLD = 24;
