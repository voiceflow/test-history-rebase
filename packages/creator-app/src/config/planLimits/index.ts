import { PlanType } from '@voiceflow/internal';

import { BOOK_DEMO_LINK } from '@/constants/links';
import { getPlanTypeLabel } from '@/utils/plans';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

/**
 * @deprecated use planLimitV2 instead
 */
export interface LimitSubmitProps {
  openPaymentModal: () => void;
}

/**
 * @deprecated use planLimitV2 instead
 */
export interface LimitDetails {
  modalTitle: string;
  title: string;
  description: string;
  submitText: string;
  onSubmit: (props: LimitSubmitProps) => void;
  tooltipText?: string;
  tooltipButtonText?: string;
  tooltipOnClick?: (props: LimitSubmitProps) => void;
  hasLabelTooltip?: boolean;
  labelTooltipTitle?: string;
  labelTooltipText?: string;
}

/**
 * @deprecated use planLimitV2 instead
 */
export enum PlanLimitCategories {
  TEAM = 'team',
  STARTER = 'starter',
}

/**
 * @deprecated use planLimitV2 instead
 */
export const ENTERPRISE_LIMIT_PLANS = [PlanType.ENTERPRISE];
export const TEAM_LIMIT_PLANS = [PlanType.OLD_TEAM, PlanType.TEAM, PlanType.PRO, PlanType.OLD_PRO];
export const STARTER_LIMIT_PLANS = [PlanType.OLD_STARTER, PlanType.STARTER, PlanType.OLD_ENTERPRISE];

/**
 * @deprecated use planLimitV2 instead
 */
export const TEAM_LABEL = getPlanTypeLabel(PlanType.TEAM);

/**
 * @deprecated use planLimitV2 instead
 */
export const ENTERPRISE_LABEL = getPlanTypeLabel(PlanType.ENTERPRISE);

export const UPGRADE_TO_TEAM_ACTION_LABEL = `Upgrade to ${TEAM_LABEL}`;
export const UPGRADE_TO_ENTERPRISE_ACTION_LABEL = 'Contact Sales';

export const upgradeToTeamAction = ({ openPaymentModal }: LimitSubmitProps) => openPaymentModal();
export const upgradeToEnterpriseAction = onOpenInternalURLInANewTabFactory(BOOK_DEMO_LINK);
