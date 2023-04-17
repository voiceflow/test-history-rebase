import { DOMAINS_LIMITS } from './domains';
import { EDITOR_SEATS_LIMITS } from './editorSeats';
import { MARKUP_IMAGE_LIMITS } from './markupImage';
import { MARKUP_VIDEO_LIMITS } from './markupVideo';
import { PROJECTS_LIMITS } from './projects';
import { buildPlanLimitRecord } from './utils';
import { VARIABLE_STATES_LIMITS } from './variableStates';
import { VIEWER_SEATS_LIMITS } from './viewerSeats';

export * from './types';

export const PLAN_LIMITS = buildPlanLimitRecord([
  DOMAINS_LIMITS,
  PROJECTS_LIMITS,
  MARKUP_VIDEO_LIMITS,
  MARKUP_IMAGE_LIMITS,
  EDITOR_SEATS_LIMITS,
  VIEWER_SEATS_LIMITS,
  VARIABLE_STATES_LIMITS,
]);

export type PlanLimits = typeof PLAN_LIMITS;
export type PlanLimitKey = keyof PlanLimits;
