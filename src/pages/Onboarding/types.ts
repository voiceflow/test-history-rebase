import { UserRole } from '@/constants';
import { Workspace } from '@/models';

export type CollaboratorType = { email: string; permission: UserRole };

export type OnboardingDataProps = {
  collaborators: CollaboratorType[];
};

export type OnboardingStepProps = {
  data: OnboardingDataProps;
  location?: any;
  firstTime?: boolean;
  workspaces?: Workspace[];
  creatorID?: number;
  fetchWorkspaces?: () => Promise<void>;
};
