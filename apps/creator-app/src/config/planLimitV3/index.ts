import { MARKUP_VIDEO_LIMITS } from '../planLimitV2/markupVideo';
import { EDITOR_SEATS_LIMITS } from './editorSeats';
import { MARKUP_IMAGE_LIMITS } from './markupImage';
import { PROJECTS_LIMITS } from './projects';
import { VARIABLE_STATES_LIMITS } from './variableStates';
import { VIEWER_SEATS_LIMITS } from './viewerSeats';

export * from './types';

export const LIMITS = {
  [EDITOR_SEATS_LIMITS.limit]: EDITOR_SEATS_LIMITS,
  [MARKUP_IMAGE_LIMITS.limit]: MARKUP_IMAGE_LIMITS,
  [MARKUP_VIDEO_LIMITS.limit]: MARKUP_VIDEO_LIMITS,
  [PROJECTS_LIMITS.limit]: PROJECTS_LIMITS,
  [VARIABLE_STATES_LIMITS.limit]: VARIABLE_STATES_LIMITS,
  [VIEWER_SEATS_LIMITS.limit]: VIEWER_SEATS_LIMITS,
} as const;

export type Limits = typeof LIMITS;
export type LimitKey = keyof Limits;
