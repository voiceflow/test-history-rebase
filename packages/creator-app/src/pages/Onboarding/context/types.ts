import { BillingPeriod, PlanType, PlatformType } from '@voiceflow/internal';

import { Query } from '@/models';

import { StepID } from '../constants';
import { CollaboratorType } from '../types';

export enum OnboardingType {
  create = 'create_workspace',
  join = 'join_workpsace',
  student = 'student',
  creator = 'creator',
}

export enum SpecificFlowType {
  login_vanilla_new = 'login_vanilla_new',
  login_student_new = 'login_student_new',
  login_payment_new = 'login_payment_new',
  login_student_existing = 'login_student_existing',
  login_invite = 'login_invite',
  create_workspace = 'create_workspace',
  login_creator_new = 'login_creator_new',
  login_creator_existing = 'login_creator_existing',
}

export interface OnboardingContextState {
  selectableWorkspace: boolean;
  specificFlowType: SpecificFlowType;
  flow: OnboardingType;
  stepStack: StepID[];
  currentStepID: StepID;
  numberOfSteps: number;
  createWorkspaceMeta: {
    workspaceName: string;
    workspaceImage: string;
  };
  personalizeWorkspaceMeta: {
    role: string;
    channels: string[];
    teamSize: string;
  };
  paymentMeta: {
    plan?: PlanType;
    couponCode?: string;
    period: BillingPeriod;
    selectedWorkspaceId: string;
    seats?: number;
  };
  addCollaboratorMeta: {
    collaborators: CollaboratorType[];
  };
  joinWorkspaceMeta: {
    role: string;
  };
  selectChannelMeta: {
    channel: PlatformType;
  };
  sendingRequests: boolean;
  workspaceId: string;
  justCreatingWorkspace: boolean;
  hasFixedPeriod: boolean;
  usedSignupCoupon?: boolean;
  hasWorkspaces?: boolean;
}

export interface OnboardingContextActions {
  stepBack: () => null;
  stepForward: (stepID: StepID | null, options?: { skip: boolean }) => void;
  closeOnboarding: VoidFunction;
  setCreateWorkspaceMeta: (data: unknown) => void;
  setPersonalizeWorkspaceMeta: (data: unknown) => void;
  setPaymentMeta: (data: unknown) => void;
  setJoinWorkspaceMeta: (data: unknown) => void;
  setSelectChannelMeta: (data: OnboardingContextState['selectChannelMeta']) => void;
  setAddCollaboratorMeta: (data: unknown) => void;
  finishCreateOnboarding: VoidFunction;
  finishJoiningWorkspace: VoidFunction;
  onCancel: VoidFunction;
  getNumberOfEditors: () => number;
}

export interface OnboardingContextProps {
  state: OnboardingContextState;
  actions: OnboardingContextActions;
}

export interface OnboardingProviderProps {
  query: Query;
  numberOfSteps?: number;
  stripe: any;
  checkChargeable: (data: any) => void;
  isLoginFlow: boolean;
}
