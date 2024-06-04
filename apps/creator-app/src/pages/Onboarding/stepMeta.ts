import { Tracking } from '@/ducks';
import { SyncThunk } from '@/store/types';

import { OnboardingContextState } from './context/types';
import { StepID } from './stepID.enum';

export interface StepMetaPropsType {
  title: (val?: string) => string;
  canBack: boolean;
  canSkip: boolean;
  trackStep: (props: OnboardingContextState, options: { skip: boolean }) => SyncThunk;
  docsLink?: React.ReactNode;
}

export type StepMetaProps = Record<StepID, StepMetaPropsType>;

export const STEP_META: StepMetaProps = {
  [StepID.WELCOME]: {
    title: () => 'Welcome',
    canBack: false,
    canSkip: false,
    trackStep: () => () => null,
  },
  [StepID.CREATE_WORKSPACE]: {
    title: () => 'Create Workspace',
    canBack: true,
    canSkip: false,
    trackStep: () => Tracking.trackOnboardingCreate(),
  },
  [StepID.PERSONALIZE_WORKSPACE]: {
    title: () => 'Create Profile',
    canBack: true,
    canSkip: false,
    trackStep: () => Tracking.trackOnboardingPersonalize(),
  },
  [StepID.JOIN_WORKSPACE]: {
    title: () => 'Join Workspace',
    canBack: true,
    canSkip: true,
    trackStep: ({ joinWorkspaceMeta }, { skip }) =>
      Tracking.trackOnboardingJoin({ skip, role: joinWorkspaceMeta.role }),
  },
};
