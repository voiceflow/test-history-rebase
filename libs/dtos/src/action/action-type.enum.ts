import type { Enum } from '@/main';

export const ActionType = {
  OPEN_URL: 'open_url',
} as const;

export type ActionType = Enum<typeof ActionType>;
