import type { Enum } from '@/utils/type/enum.util';

export const ActionType = {
  OPEN_URL: 'open_url',
} as const;

export type ActionType = Enum<typeof ActionType>;
