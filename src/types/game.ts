/** 6대 능력치 키 */
export type StatKey =
  | 'physical'
  | 'speech'
  | 'creativity'
  | 'charm'
  | 'social'
  | 'mental';

export type Stats = Record<StatKey, number>;

/** 의뢰 등급 — 추후 확장 가능 */
export type RequestGrade = 'normal' | 'rare' | 'special' | 'important';

export type ScheduleType = 'wait' | 'work' | 'rest' | 'growth';

export type LogCategory = 'request' | 'economy' | 'staff' | 'system';

export interface Manager {
  stats: Stats;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  disposition: string;
  tags: string[];
  stats: Stats;
}

export interface RequestTemplate {
  id: string;
  title: string;
  description: string;
  grade: RequestGrade;
  requiredStats: Partial<Stats>;
  tags: string[];
  reward: number;
  difficulty: number;
}

export interface RequestInstance {
  instanceId: string;
  templateId: string;
  title: string;
  description: string;
  grade: RequestGrade;
  requiredStats: Partial<Stats>;
  tags: string[];
  reward: number;
  difficulty: number;
}

export interface StaffAssignment {
  staffId: string;
  scheduleType: ScheduleType;
  requestInstanceId?: string;
}

export interface LogEntry {
  id: string;
  category: LogCategory;
  message: string;
}

export interface TurnLog {
  turn: number;
  weekLabel: string;
  entries: LogEntry[];
  summary: string;
}

export interface GameSettings {
  inputMode: 'drag' | 'select';
  narrativeSpeed: 'sequential' | 'instant';
}

export interface EconomyBalance {
  startingMoney: number;
  monthlyRent: number;
  monthlySalaryPerStaff: number;
  monthlyUtilities: number;
  requestPoolSize: number;
}

export interface GameState {
  schemaVersion: number;
  playthrough: number;
  turn: number;
  money: number;
  officeLevel: number;
  arrearsMonths: number;
  manager: Manager;
  staff: Staff[];
  requests: RequestInstance[];
  assignments: StaffAssignment[];
  turnLogs: TurnLog[];
  settings: GameSettings;
  lastSummary: string | null;
}

export interface TurnAdvanceSuccess {
  ok: true;
  state: GameState;
  summary: string;
}

export interface TurnAdvanceFailure {
  ok: false;
  error: string;
}

export type TurnAdvanceResult = TurnAdvanceSuccess | TurnAdvanceFailure;

export interface RecommendedStaff {
  staff: Staff;
  matchScore: number;
  reasons: string[];
}
