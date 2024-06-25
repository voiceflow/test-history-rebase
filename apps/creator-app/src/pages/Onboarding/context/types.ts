import type { SmartReducerAPi } from '@voiceflow/ui';

import type { Query } from '@/models';

import type { OnboardingType } from '../onboardingType.enum';
import type { StepID } from '../stepID.enum';
import type { STEPS_BY_FLOW } from './constants';

export interface PersonalizeWorkspaceMeta {
  useCase: string;
  channels: string[];
  teamSize: string;
  selfReportedAttribution: string;
  workWithDevelopers: boolean | null;
}

type FlowSteps = (typeof STEPS_BY_FLOW)[OnboardingType];

export interface OnboardingContextState {
  steps: FlowSteps;
  flow: OnboardingType;
  stepStack: StepID[];
  sendingRequests: boolean;
  createWorkspaceMeta: {
    workspaceName: string;
    workspaceImage: string;
  };
  personalizeWorkspaceMeta: PersonalizeWorkspaceMeta;
  joinWorkspaceMeta: {
    role: string;
  };
}

export interface OnboardingContextAPI {
  state: OnboardingContextState;
  stateAPI: SmartReducerAPi<OnboardingContextState>;

  stepBack: VoidFunction;
  stepForward: (options?: { skip: boolean }) => void;
  getCurrentStepID: () => StepID;
}

export interface OnboardingProviderProps extends React.PropsWithChildren {
  query: Query;
}
