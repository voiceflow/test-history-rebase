import { PlanType } from '@voiceflow/internal';

import { BlockType } from '@/constants';
import { Permission } from '@/constants/permissions';
import { STUDENT_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeModalProps } from '@/utils/upgrade';

import { UpgradeTooltipPlanPermission } from './types';

export type PaidStepType = BlockType.CODE | BlockType.TRACE;
export const PAID_STEPS = new Set<PaidStepType>([BlockType.CODE, BlockType.TRACE]);

export interface Data {
  stepType: PaidStepType;
}

export const LOCKED_STEPS_LABELS: Record<PaidStepType, string> = {
  [BlockType.CODE]: 'Javascript',
  [BlockType.TRACE]: 'Custom Actions',
};

export interface CanvasPaidStepsPermission extends UpgradeTooltipPlanPermission<Data> {
  isPaidStep: (blockType?: BlockType | null) => blockType is PaidStepType;
}

export const CANVAS_PAID_STEPS = {
  plans: STUDENT_PLUS_PLANS,
  permission: Permission.CANVAS_PAID_STEPS,

  isPaidStep: (blockType?: BlockType | null): blockType is PaidStepType => !!blockType && PAID_STEPS.has(blockType as PaidStepType),

  upgradeTooltip: ({ stepType }) => ({
    ...getUpgradeModalProps(PlanType.PRO, Tracking.UpgradePrompt.LOCKED_STEPS),
    description: `Extend the power of your agents by adding ${LOCKED_STEPS_LABELS[stepType]}.`,
  }),
} satisfies CanvasPaidStepsPermission;
