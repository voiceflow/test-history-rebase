import { LimitType } from './constants';
import { DOMAINS_LIMITS } from './domains';
import { MARKUP_IMAGE_LIMITS } from './markupImage';
import { MARKUP_VIDEO_LIMITS } from './markupVideo';

export * from './constants';
export * from './types';

export const LIMITS = {
  [LimitType.DOMAINS]: DOMAINS_LIMITS,
  [LimitType.MARKUP_VIDEO]: MARKUP_VIDEO_LIMITS,
  [LimitType.MARKUP_IMAGE]: MARKUP_IMAGE_LIMITS,
} as const;

export type Limits = typeof LIMITS;
