import type { Enum } from '@/utils/type/enum.util';

export const CanvasVisibility = {
  FULL: 'full',
  HIDDEN: 'hidden',
  CROPPED: 'cropped',
} as const;

export type CanvasVisibility = Enum<typeof CanvasVisibility>;
