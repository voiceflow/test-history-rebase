import type { Enum } from '@/utils/type/enum.util';

export const Language = {
  ENGLISH_US: 'en-us',
} as const;

export type Language = Enum<typeof Language>;
