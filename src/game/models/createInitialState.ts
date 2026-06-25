import { economyBalance, initialStaffRoster, requestTemplates } from '@/game/data/loadBalance';
import type {
  GameSettings,
  GameState,
  RequestInstance,
  StaffAssignment,
} from '@/types/game';
import { SCHEMA_VERSION } from '@/game/constants';

const DEFAULT_SETTINGS: GameSettings = {
  inputMode: 'select',
  narrativeSpeed: 'sequential',
};

const createInstanceId = (templateId: string, turn: number, index: number): string => {
  return `${templateId}-t${turn}-${index}`;
};

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

export const createInitialState = (playthrough = 1): GameState => {
  const staff = initialStaffRoster.map((member) => ({
    ...member,
    stats: { ...member.stats },
    tags: [...member.tags],
  }));

  const requests = fillRequestPool([], economyBalance.requestPoolSize, 1);

  return {
    schemaVersion: SCHEMA_VERSION,
    playthrough,
    turn: 1,
    money: economyBalance.startingMoney,
    officeLevel: 1,
    arrearsMonths: 0,
    manager: {
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
    turnLogs: [],
    settings: {
      ...DEFAULT_SETTINGS,
      narrativeSpeed: playthrough >= 2 ? 'instant' : 'sequential',
    },
    lastSummary: null,
  };
};
