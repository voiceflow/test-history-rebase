import { BillingPeriod, PlanType } from '@voiceflow/internal';

import { IS_PRIVATE_CLOUD } from '@/config';
import { Query } from '@/models';

import { StepID } from '../constants';
import { OnboardingType, SpecificFlowType } from './types';

export const getFirstStep = ({
  flow,
  isLoginFlow,
  isFirstSession,
  hasPresetSeats,
}: {
  flow: OnboardingType;
  isLoginFlow: boolean;
  isFirstSession: boolean;
  hasPresetSeats: boolean;
}) => {
  if (!isLoginFlow) {
    return OnboardingType.create;
  }

  switch (flow) {
    case OnboardingType.create:
      return StepID.WELCOME;
    case OnboardingType.join:
      return StepID.JOIN_WORKSPACE;
    case OnboardingType.creator:
    case OnboardingType.general_upgrade:
    case OnboardingType.student:
      return isFirstSession || !hasPresetSeats ? StepID.WELCOME : StepID.PAYMENT;
    default:
      return StepID.WELCOME;
  }
};

export const getSpecificFlowType = (flow: OnboardingType, loginFlow: boolean, isFirstSession: boolean) => {
  if (flow === OnboardingType.join) {
    return SpecificFlowType.login_invite;
  }
  if (flow === OnboardingType.student && !isFirstSession) {
    return SpecificFlowType.login_student_existing;
  }
  if (flow === OnboardingType.creator && !isFirstSession) {
    return SpecificFlowType.login_creator_existing;
  }
  if (flow === OnboardingType.general_upgrade && !isFirstSession) {
    return SpecificFlowType.existing_user_general_upgrade;
  }
  if (loginFlow && isFirstSession && flow === OnboardingType.student) {
    return SpecificFlowType.login_student_new;
  }
  if (loginFlow && isFirstSession && flow === OnboardingType.creator) {
    return SpecificFlowType.login_creator_new;
  }
  if (loginFlow) {
    return SpecificFlowType.login_vanilla_new;
  }

  return SpecificFlowType.create_workspace;
};

export const getNumberOfSteps = ({
  specificFlowType,
  hasPresetSeats,
  hasWorkspaces,
  isAdminOfEnterprisePlan,
}: {
  specificFlowType: SpecificFlowType;
  hasPresetSeats: boolean;
  hasWorkspaces: boolean;
  isAdminOfEnterprisePlan: boolean;
}): number => {
  switch (specificFlowType) {
    case SpecificFlowType.login_invite:
      return 1;
    case SpecificFlowType.login_student_existing:
    case SpecificFlowType.login_creator_existing:
    case SpecificFlowType.existing_user_general_upgrade:
      return hasPresetSeats ? 1 : 2;
    case SpecificFlowType.create_workspace:
      return !hasWorkspaces || isAdminOfEnterprisePlan || IS_PRIVATE_CLOUD ? 2 : 3;
    case SpecificFlowType.login_creator_new:
    case SpecificFlowType.login_student_new:
      return 4;
    case SpecificFlowType.login_vanilla_new:
      return 3;
    default:
      return 3;
  }
};

export const extractQueryParams = ({ ob_period, invite, ob_seats }: Query) => {
  const configurations = {
    plan: PlanType.PRO,
    period: BillingPeriod.ANNUALLY,
    flow: invite ? OnboardingType.join : OnboardingType.create,
    seats: ob_seats ?? 0,
  };

  if (ob_period && Object.values(BillingPeriod).includes(ob_period)) {
    configurations.period = ob_period;
  }

  return configurations;
};
