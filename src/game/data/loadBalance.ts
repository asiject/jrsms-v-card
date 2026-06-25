import economyJson from '@/data/balance/economy.json';
import requestTemplatesJson from '@/data/balance/requests.json';
import staffJson from '@/data/balance/staff.json';
import type {
  EconomyBalance,
  RequestTemplate,
  Staff,
} from '@/types/game';

export const economyBalance = economyJson as EconomyBalance;

export const requestTemplates = requestTemplatesJson as RequestTemplate[];

export const initialStaffRoster = staffJson as Staff[];
