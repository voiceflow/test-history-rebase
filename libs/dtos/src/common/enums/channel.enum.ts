import type { Enum } from '@/utils/type/enum.util';

export const Channel = {
  DEFAULT: 'default',
} as const;

export type Channel = Enum<typeof Channel>;
