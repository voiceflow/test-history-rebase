import { LimitType } from './constants';
import { DOMAINS_LIMITS } from './domains';
import { MARKUP_IMAGE_LIMITS } from './markupImage';
import { MARKUP_VIDEO_LIMITS } from './markupVideo';
import { NLU_IMPORT_LIMITS } from './nluImport';
import { PROJECTS_LIMITS } from './projects';
import { VARIABLE_STATES_LIMITS } from './variableStates';

export * from './constants';
export * from './types';

export const LIMITS = {
  [LimitType.DOMAINS]: DOMAINS_LIMITS,
  [LimitType.PROJECTS]: PROJECTS_LIMITS,
  [LimitType.NLU_IMPORT]: NLU_IMPORT_LIMITS,
  [LimitType.MARKUP_VIDEO]: MARKUP_VIDEO_LIMITS,
  [LimitType.MARKUP_IMAGE]: MARKUP_IMAGE_LIMITS,
  [LimitType.VARIABLE_STATES]: VARIABLE_STATES_LIMITS,
} as const;

export type Limits = typeof LIMITS;
