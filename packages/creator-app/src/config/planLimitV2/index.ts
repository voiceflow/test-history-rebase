import { LimitType } from './constants';
import { DOMAINS_LIMITS } from './domains';
import { EDITOR_SEATS_LIMITS } from './editorSeats';
import { MARKUP_IMAGE_LIMITS } from './markupImage';
import { MARKUP_VIDEO_LIMITS } from './markupVideo';
import { PROJECTS_LIMITS } from './projects';
import { VARIABLE_STATES_LIMITS } from './variableStates';
import { VIEWER_SEATS_LIMITS } from './viewerSeats';

export * from './constants';
export * from './types';

export const LIMITS = {
  [LimitType.DOMAINS]: DOMAINS_LIMITS,
  [LimitType.PROJECTS]: PROJECTS_LIMITS,
  [LimitType.MARKUP_VIDEO]: MARKUP_VIDEO_LIMITS,
  [LimitType.MARKUP_IMAGE]: MARKUP_IMAGE_LIMITS,
  [LimitType.EDITOR_SEATS]: EDITOR_SEATS_LIMITS,
  [LimitType.VIEWER_SEATS]: VIEWER_SEATS_LIMITS,
  [LimitType.VARIABLE_STATES]: VARIABLE_STATES_LIMITS,
} as const;

export type Limits = typeof LIMITS;
