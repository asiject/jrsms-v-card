import { economyBalance, initialStaffRoster, requestTemplates } from '@/game/data/loadBalance';
import { OFFICE_NAME } from '@/game/data/tutorialContent';
import { SCHEMA_VERSION } from '@/game/constants';
import { createTutorialState } from '@/game/models/createTutorialState';
import type {
  GameSettings,
  GameState,
  RequestInstance,
  StaffAssignment,
  TutorialState,
} from '@/types/game';

const DEFAULT_SETTINGS: GameSettings = {
  inputMode: 'select',
  narrativeSpeed: 'sequential',
};

const COMPLETED_TUTORIAL: TutorialState = {
  isActive: false,
  completed: true,
  phase: 'complete',
  tutorialTurn: 4,
  eventChoiceId: null,
};

const createInstanceId = (templateId: string, turn: number, index: number): string => {
  return `${templateId}-t${turn}-${index}`;
};

/** 의뢰 풀을 목표 수만큼 채움 */
export const fillRequestPool = (
  current: RequestInstance[],
  targetSize: number,
  turn: number,
): RequestInstance[] => {
  const next = [...current];
  let index = 0;

  while (next.length < targetSize) {
    const template = requestTemplates[index % requestTemplates.length];
    next.push({
      instanceId: createInstanceId(template.id, turn, index),
      templateId: template.id,
      title: template.title,
      description: template.description,
      grade: template.grade,
      requiredStats: { ...template.requiredStats },
      tags: [...template.tags],
      reward: template.reward,
      difficulty: template.difficulty,
    });
    index += 1;
  }

  return next;
};

const createDefaultAssignments = (staffIds: string[]): StaffAssignment[] => {
  return staffIds.map((staffId) => ({
    staffId,
    scheduleType: 'wait',
  }));
};

/** 본편 초기 상태 (튜토리얼 완료 후) */
export const createMainGameState = (playthrough = 1, carry?: Partial<GameState>): GameState => {
  const staff = initialStaffRoster.map((member) => {
    const carried = carry?.staff?.find((item) => item.id === member.id);

    if (carried !== undefined) {
      return {
        ...carried,
        stats: { ...carried.stats },
        tags: [...carried.tags],
      };
    }

    return {
      ...member,
      stats: { ...member.stats },
      tags: [...member.tags],
    };
  });

  const requests = fillRequestPool([], economyBalance.requestPoolSize, 1);

  return {
    schemaVersion: SCHEMA_VERSION,
    playthrough,
    turn: 1,
    money: carry?.money ?? economyBalance.startingMoney,
    officeLevel: carry?.officeLevel ?? 1,
    officeName: OFFICE_NAME,
    arrearsMonths: carry?.arrearsMonths ?? 0,
    manager: carry?.manager ?? {
      stats: {
        physical: 8,
        speech: 10,
        creativity: 9,
        charm: 9,
        social: 10,
        mental: 10,
      },
    },
    staff,
    requests,
    assignments: createDefaultAssignments(staff.map((member) => member.id)),
    turnLogs: carry?.turnLogs ?? [],
    settings: carry?.settings ?? {
      ...DEFAULT_SETTINGS,
      narrativeSpeed: playthrough >= 2 ? 'instant' : 'sequential',
    },
    lastSummary: null,
    tutorial: COMPLETED_TUTORIAL,
    goals: carry?.goals ?? null,
  };
};

export const createInitialState = (playthrough = 1): GameState => {
  if (playthrough >= 2) {
    return createMainGameState(playthrough);
  }

  return createTutorialState(playthrough);
};
