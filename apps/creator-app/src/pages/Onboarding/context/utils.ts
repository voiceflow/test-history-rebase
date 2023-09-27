import { BillingPeriod, PlanType, UserRole } from '@voiceflow/internal';

import { IS_PRIVATE_CLOUD } from '@/config';
import { Query } from '@/models';

import { StepID } from '../constants';
import { CollaboratorType } from '../types';
import { OnboardingType, SpecificFlowType } from './types';

export const getNumberOfEditorSeats = (collaborators: CollaboratorType[]) => {
  const members = collaborators.filter((collaborator: CollaboratorType) => {
    const { permission } = collaborator;
    return permission === UserRole.EDITOR;
  });
  // + 1 for the owner
  return members.length + 1;
};

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
      // eslint-disable-next-line no-nested-ternary
      return isFirstSession ? StepID.WELCOME : hasPresetSeats ? StepID.PAYMENT : StepID.ADD_COLLABORATORS;
    default:
      return StepID.WELCOME;
  }
};

export const getSpecificFlowType = (query: Query, flow: OnboardingType, loginFlow: boolean, isFirstSession: boolean) => {
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
  if (query?.ob_payment) {
    return SpecificFlowType.login_payment_new;
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
    case SpecificFlowType.login_payment_new:
      return 5;
    case SpecificFlowType.login_vanilla_new:
      return 4;
    default:
      return 4;
  }
};

export const extractQueryParams = ({ ob_plan, ob_period, invite, ob_seats, ob_payment }: Query, isLoggedIn: boolean) => {
  const configurations = {
    plan: PlanType.PRO,
    period: BillingPeriod.ANNUALLY,
    flow: invite ? OnboardingType.join : OnboardingType.create,
    seats: ob_seats ?? 0,
  };

  if (ob_plan && Object.values(PlanType).includes(ob_plan)) {
    configurations.plan = ob_plan;
  }

  // Wants to upgrade an existing workspace
  if (isLoggedIn && ob_payment) {
    configurations.flow = OnboardingType.general_upgrade;
  }

  if (ob_period && Object.values(BillingPeriod).includes(ob_period)) {
    configurations.period = ob_period;
  }

  return configurations;
};
