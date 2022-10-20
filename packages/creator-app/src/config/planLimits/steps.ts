import { PlanType } from '@voiceflow/internal';

import { ENTERPRISE_LIMIT_PLANS, TEAM_LIMIT_PLANS, UPGRADE_TO_TEAM_ACTION_LABEL } from '@/config/planLimits';
import { BlockType } from '@/constants';

export const LOCKED_STEPS = new Set([BlockType.CODE, BlockType.TRACE]);

export type LockedStepTypes = BlockType.CODE | BlockType.TRACE;

export const LockedStepLabels = {
  [BlockType.CODE]: 'Javascript',
  [BlockType.TRACE]: 'Custom Actions',
};

export const getLockedStepTooltipText = (step: LockedStepTypes) => `Extend the power of your assistants by adding ${LockedStepLabels[step]}.`;

export const lockedStepTooltipButtonText = UPGRADE_TO_TEAM_ACTION_LABEL;

export const isLockedStep = (plan: PlanType | null | undefined, step: BlockType) =>
  plan && !(ENTERPRISE_LIMIT_PLANS.includes(plan) || TEAM_LIMIT_PLANS.includes(plan)) && LOCKED_STEPS.has(step);
