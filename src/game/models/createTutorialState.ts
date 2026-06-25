import { SCHEMA_VERSION } from '@/game/constants';
import { OFFICE_NAME, TUTORIAL_STAFF_ID } from '@/game/data/tutorialContent';
import { initialStaffRoster } from '@/game/data/loadBalance';
import type { GameSettings, GameState, StaffAssignment } from '@/types/game';

const DEFAULT_SETTINGS: GameSettings = {
  inputMode: 'select',
  narrativeSpeed: 'sequential',
};

const createDefaultAssignments = (staffIds: string[]): StaffAssignment[] => {
  return staffIds.map((staffId) => ({
    staffId,
    scheduleType: 'wait',
  }));
};

const getTutorialStaff = () => {
  const member = initialStaffRoster.find((item) => item.id === TUTORIAL_STAFF_ID);

  if (member === undefined) {
    throw new Error('튜토리얼 인력원 데이터를 찾을 수 없습니다.');
  }

  return {
    ...member,
    stats: { ...member.stats },
    tags: [...member.tags],
  };
};

export const createTutorialState = (playthrough = 1): GameState => {
  const staff = [getTutorialStaff()];

  return {
    schemaVersion: SCHEMA_VERSION,
    playthrough,
    turn: 1,
    money: 12000,
    officeLevel: 1,
    officeName: OFFICE_NAME,
    arrearsMonths: 0,
    manager: {
      stats: {
        physical: 6,
        speech: 5,
        creativity: 6,
        charm: 7,
        social: 5,
        mental: 8,
      },
    },
    staff,
    requests: [],
    assignments: createDefaultAssignments(staff.map((member) => member.id)),
    turnLogs: [],
    settings: {
      ...DEFAULT_SETTINGS,
      narrativeSpeed: playthrough >= 2 ? 'instant' : 'sequential',
    },
    lastSummary: null,
    tutorial: {
      isActive: true,
      completed: false,
      phase: 'intro',
      tutorialTurn: 1,
      eventChoiceId: null,
    },
    goals: null,
  };
};
