import type { Enum } from '@/utils/type/enum';

export const VisualType = {
  APL: 'apl',
  IMAGE: 'image',
} as const;

export type VisualType = Enum<typeof VisualType>;
