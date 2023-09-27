import { BillingPeriod, PlanType } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';

import { Query } from '@/models';

import type { StepID } from '../constants';
import { CollaboratorType } from '../types';

export enum OnboardingType {
  create = 'create_workspace',
  join = 'join_workpsace',
  student = 'student',
  creator = 'creator',
  general_upgrade = 'general_upgrade',
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
  existing_user_general_upgrade = 'existing_user_general_upgrade',
}

export interface PersonalizeWorkspaceMeta {
  role: string;
  channels?: string[];
  teamSize?: string;
  selfReportedAttribution?: string;
  workWithDevelopers?: boolean | null;
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
  personalizeWorkspaceMeta: PersonalizeWorkspaceMeta;
  paymentMeta: {
    plan?: PlanType;
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
    platform: Platform.Constants.PlatformType;
    projectType: Platform.Constants.ProjectType;
  };
  sendingRequests: boolean;
  workspaceId: string;
  justCreatingWorkspace: boolean;
  hasFixedPeriod: boolean;
  hasWorkspaces?: boolean;
  upgradingAWorkspace: boolean;
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
  isLoginFlow: boolean;
}
