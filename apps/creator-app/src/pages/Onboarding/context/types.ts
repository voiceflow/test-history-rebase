import { SmartReducerAPi } from '@voiceflow/ui';

import { Query } from '@/models';

import { OnboardingType } from '../onboardingType.enum';
import { StepID } from '../stepID.enum';
import { STEPS_BY_FLOW } from './constants';

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
