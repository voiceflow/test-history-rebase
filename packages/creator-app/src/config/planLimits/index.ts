import { PlanType } from '@voiceflow/internal';

import { BOOK_DEMO_LINK } from '@/constants/links';
import { getPlanTypeLabel } from '@/utils/plans';

export interface LimitSubmitProps {
  openPaymentModal: () => void;
}

export interface LimitDetails {
  modalTitle: string;
  title: string;
  description: string;
  submitText: string;
  onSubmit: (props: LimitSubmitProps) => void;
}

export enum PlanLimitCategories {
  TEAM = 'team',
  STARTER = 'starter',
}

export const ENTERPRISE_LIMIT_PLANS = [PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE];
export const TEAM_LIMIT_PLANS = [PlanType.OLD_TEAM, PlanType.TEAM, PlanType.PRO, PlanType.OLD_PRO];
export const STARTER_LIMIT_PLANS = [PlanType.OLD_STARTER, PlanType.STARTER];

export const TEAM_LABEL = getPlanTypeLabel(PlanType.TEAM);
export const ENTERPRISE_LABEL = getPlanTypeLabel(PlanType.ENTERPRISE);

export const UPRADE_TO_TEAM_ACTION_LABEL = `Upgrade to ${TEAM_LABEL}`;
export const UPGRADE_TO_ENTERPRISE_ACTION_LABEL = 'Contact Sales';

export const upgradeToTeamAction = ({ openPaymentModal }: LimitSubmitProps) => openPaymentModal();
export const upgradeToEnterpriseAction = () => window.open(BOOK_DEMO_LINK, '_blank');

export * from './variableStates';
