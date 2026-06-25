import { TUTORIAL_REQUEST_ID, TUTORIAL_STAFF_ID } from '@/game/data/tutorialContent';
import type { GameState, StaffAssignment } from '@/types/game';

const getTutorialStaffAssignment = (
  assignments: StaffAssignment[],
): StaffAssignment | undefined => {
  return assignments.find((assignment) => assignment.staffId === TUTORIAL_STAFF_ID);
};

export const validateTutorialTurn = (state: GameState): string | null => {
  const assignment = getTutorialStaffAssignment(state.assignments);

  if (assignment === undefined) {
    return '튜토리얼 인력원 스케줄을 지정해 주세요.';
  }

  const { tutorialTurn } = state.tutorial;

  if (tutorialTurn === 1 && assignment.scheduleType !== 'wait') {
    return '튜토리얼 1주차: 한지우에게 「의뢰 대기」를 배정하세요.';
  }

  if (tutorialTurn === 2) {
    if (assignment.scheduleType !== 'work') {
      return '튜토리얼 2주차: 한지우에게 「의뢰 수행」을 배정하세요.';
    }

    if (assignment.requestInstanceId !== TUTORIAL_REQUEST_ID) {
      return '튜토리얼 2주차: 「지상 세금 서류 정리」 의뢰를 선택해 배정하세요.';
    }
  }

  if (
    tutorialTurn === 3 &&
    assignment.scheduleType !== 'rest' &&
    assignment.scheduleType !== 'growth'
  ) {
    return '튜토리얼 3주차: 한지우에게 「휴식」 또는 「성장」을 배정하세요.';
  }

  if (tutorialTurn === 4 && assignment.scheduleType === 'work') {
    if (assignment.requestInstanceId === undefined) {
      return '의뢰 수행을 선택했다면 의뢰를 배정해 주세요.';
    }
  }

  return null;
};
