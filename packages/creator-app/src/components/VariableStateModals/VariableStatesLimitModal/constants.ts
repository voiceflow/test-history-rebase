import { PlanType } from '@voiceflow/internal';

import { BOOK_DEMO_LINK } from '@/constants/links';
import { getPlanTypeLabel } from '@/utils/plans';

import { LimitDetails, LimitSubmitProps, VariableStatesLimits } from './types';

// refactor - move it to internal library (VF-3328)
export const TEAM_LIMIT_PLANS = [PlanType.OLD_TEAM, PlanType.TEAM, PlanType.PRO, PlanType.OLD_PRO];
export const STARTER_LIMIT_PLANS = [PlanType.OLD_STARTER, PlanType.STARTER];

// refactor - get plan limits from backend (VF-3328)
export const TEAM_LIMIT = 3;

const PRO_LABEL = getPlanTypeLabel(PlanType.PRO);
const ENTERPRISE_LABEL = getPlanTypeLabel(PlanType.ENTERPRISE);

export const VariableStatesLimitDetails: Record<VariableStatesLimits, LimitDetails> = {
  [VariableStatesLimits.STARTER]: {
    title: 'Need more variable states?',
    description: `You’ve used your free variable state. Upgrade to ${PRO_LABEL} to unlock up to ${TEAM_LIMIT} variable states.`,
    submitText: `Upgrade to ${PRO_LABEL}`,
    onSubmit: ({ openPaymentModal }: LimitSubmitProps) => openPaymentModal(),
  },
  [VariableStatesLimits.TEAM]: {
    title: `Need more than ${TEAM_LIMIT} variable states?`,
    description: `You’ve used all ${TEAM_LIMIT} variable states. Upgrade to ${ENTERPRISE_LABEL} to unlock unlimited.`,
    submitText: 'Contact Sales',
    onSubmit: () => window.open(BOOK_DEMO_LINK, '_blank'),
  },
};
