export const OFFICE_NAME = '마력사무소';

export const DIRECTOR_NAME = '마력왕';

export const DIRECTOR_TITLE = '열혈 사무소장';

export const TUTORIAL_TURNS = 4;

export const TUTORIAL_STAFF_ID = 'staff-001';

export const TUTORIAL_REQUEST_ID = 'tutorial-req-001';

export interface TutorialBeat {
  title: string;
  body: string[];
  objective: string;
}

export interface TutorialIntroContent {
  title: string;
  paragraphs: string[];
  signLabel: string;
}

export interface TutorialEventChoice {
  id: string;
  label: string;
  description: string;
  moneyDelta: number;
  logMessage: string;
}

export interface ShortTermGoalOption {
  id: string;
  label: string;
  description: string;
}

export const TUTORIAL_INTRO: TutorialIntroContent = {
  title: '마력사무소, 그리고 당신',
  paragraphs: [
    '한때 마계를 다스리던 마력왕은 마력을 거의 잃은 채 지상으로 쫓겨났습니다.',
    '생계를 위해 「마력사무소」를 차렸지만, 의뢰는 쌓이고 정산은 엉망이었습니다.',
    '열혈한 사무소장은 인력원 한 명과 고군분투했으나, 사무소는 제대로 돌아가지 않았습니다.',
    '그때 길을 지나던 당신을 붙잡은 그가 외쳤습니다. “잠깐! 당신, 매니저 해볼래요?!”',
    '영문 계약서 한 장도 못 알아보는 채, 당신은 어느새 매니저로 취업해 있었습니다.',
    '이제부터 당신이 이 혼란스러운 사무소를 정리해야 합니다. 마계 복귀는… 아직 먼 이야기입니다.',
  ],
  signLabel: '취업 계약서에 사인한다',
};

export const TUTORIAL_BEATS: Record<number, TutorialBeat> = {
  1: {
    title: '튜토리얼 1주차 — 의뢰 대기',
    body: [
      `「${OFFICE_NAME}」 첫 출근날. 사무소장 ${DIRECTOR_NAME}이 서류 더미를 밀어 내며 말합니다.`,
      '“의뢰가 들어오려면 누군가 대기해야 해요! 한지우에게 의뢰 대기를 맡겨 보세요!”',
    ],
    objective: '한지우에게 「의뢰 대기」 스케줄을 지정한 뒤 턴을 종료하세요.',
  },
  2: {
    title: '튜토리얼 2주차 — 의뢰 수행',
    body: [
      '지난주 대기 덕분에 지상 세금 서류 정리 의뢰가 들어왔습니다.',
      '사무소장은 떨리는 손으로 의뢰서를 건넵니다. “이번엔… 제대로 해봅시다!”',
    ],
    objective: '의뢰를 선택하고 한지우에게 「의뢰 수행」을 배정한 뒤 턴을 종료하세요.',
  },
  3: {
    title: '튜토리얼 3주차 — 휴식·성장',
    body: [
      '한지우가 지친 기색을 보입니다. 마력사무소는 아직 거칠지만, 사람을 쉬게 할 여유는 있어야 합니다.',
      '휴식으로 회복시키거나, 성장 스케줄로 역량을 키워 보세요.',
    ],
    objective: '한지우에게 「휴식」 또는 「성장」을 배정한 뒤 턴을 종료하세요.',
  },
  4: {
    title: '튜토리얼 4주차 — 사무소 위기',
    body: [
      '마력왕이 지상어 임대 계약서를 거꾸로 들고 왔습니다. 영문을 모르는 당신도 문제라는 눈치입니다.',
      '마지막 가이드 주간입니다. 턴을 마친 뒤 돌발 상황에 대응하고, 목표를 정하면 본편이 시작됩니다.',
    ],
    objective: '아무 스케줄이나 배정하고 턴을 종료하세요. (이후 선택 이벤트 진행)',
  },
};

export const TUTORIAL_EVENT = {
  title: '거꾸로 든 영문 계약서',
  body: [
    `${DIRECTOR_NAME}: “이거 그냥 제출하면… 월세가 두 배가 된다는데요?!”`,
    '지상어 계약서를 누가 봐줘야 할 것 같습니다. 당신의 선택은?',
  ],
  choices: [
    {
      id: 'fix-contract',
      label: '밤새 계약서를 정리한다',
      description: '매니저가 용어 사전을 들고 수정합니다. 영문은 여전히 어렵지만…',
      moneyDelta: 0,
      logMessage: '계약서 긴급 수정 — 추가 벌금 면함',
    },
    {
      id: 'submit-anyway',
      label: '일단 그대로 제출한다',
      description: '사무소장의 열정을 믿고 제출합니다. 믿음만큼은 마력보다 강합니다.',
      moneyDelta: -3000,
      logMessage: '잘못된 계약 제출 — 위약금 3,000원',
    },
  ] satisfies TutorialEventChoice[],
};

export const QUARTER_GOAL_LABEL = '분기 목표: 마력사무소 자금 80,000원 달성';

export const SHORT_TERM_GOAL_OPTIONS: ShortTermGoalOption[] = [
  {
    id: 'short-clear-request',
    label: '이번 주 의뢰 1건 성공시키기',
    description: '첫 주부터 실적을 내겠습니다.',
  },
  {
    id: 'short-rest-staff',
    label: '인력원 휴식 1회 배정하기',
    description: '무리하지 않는 운영이 우선입니다.',
  },
  {
    id: 'short-learn-promo',
    label: '홍보 방법 알아보기',
    description: '마력 대신 홍보로 살아남을 계획입니다.',
  },
];

export const createTutorialRequest = () => ({
  instanceId: TUTORIAL_REQUEST_ID,
  templateId: 'tutorial-template',
  title: '지상 세금 서류 정리',
  description: '마력사무소 명의로 쌓인 지상 세금 서류를 분류·제출해야 합니다.',
  grade: 'normal' as const,
  requiredStats: { speech: 6, mental: 5 },
  tags: ['협상', '기획'],
  reward: 8000,
  difficulty: 1,
});
