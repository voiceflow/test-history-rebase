import { PlanType } from '@voiceflow/internal';

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

export * from './variableStates';
