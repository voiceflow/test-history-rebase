import { LimitType } from './constants';
import { MARKUP_IMAGE_LIMITS } from './markupImage';
import { MARKUP_VIDEO_LIMITS } from './markupVideo';

export * from './constants';
export * from './types';

export const LIMITS = {
  [LimitType.MARKUP_VIDEO]: MARKUP_VIDEO_LIMITS,
  [LimitType.MARKUP_IMAGE]: MARKUP_IMAGE_LIMITS,
} as const;

export type Limits = typeof LIMITS;
