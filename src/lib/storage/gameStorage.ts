import { SCHEMA_VERSION, SAVE_STORAGE_KEY } from '@/game/constants';
import { OFFICE_NAME } from '@/game/data/tutorialContent';
import { createInitialState } from '@/game/models/createInitialState';
import type { GameState, TutorialState } from '@/types/game';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const DEFAULT_TUTORIAL: TutorialState = {
  isActive: false,
  completed: true,
  phase: 'complete',
  tutorialTurn: 4,
  eventChoiceId: null,
};

const migrateV1ToV2 = (raw: Record<string, unknown>): GameState => {
  const base = raw as unknown as GameState;

  return {
    ...base,
    schemaVersion: SCHEMA_VERSION,
    officeName: OFFICE_NAME,
    tutorial: DEFAULT_TUTORIAL,
    goals: null,
  };
};

const migrateSave = (raw: Record<string, unknown>): GameState => {
  const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 1;

  if (version === SCHEMA_VERSION) {
    return raw as unknown as GameState;
  }

  if (version === 1) {
    return migrateV1ToV2(raw);
  }

  return createInitialState();
};

export const saveGameState = (state: GameState): void => {
  const payload: GameState = {
    ...state,
    schemaVersion: SCHEMA_VERSION,
  };

  localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
};

export const loadGameState = (): GameState | null => {
  const rawText = localStorage.getItem(SAVE_STORAGE_KEY);

  if (rawText === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(rawText);

    if (!isRecord(parsed)) {
      return null;
    }

    return migrateSave(parsed);
  } catch (error) {
    console.error('세이브 로드 실패:', error);

    return null;
  }
};

export const clearGameState = (): void => {
  localStorage.removeItem(SAVE_STORAGE_KEY);
};
