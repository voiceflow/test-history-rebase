import { UserRole } from '@/constants';

export type CollaboratorType = { email: string; permission: UserRole };

export type OnboardingDataProps = {
  collaborators: CollaboratorType[];
};

export type OnboardingStepProps = {
  data: OnboardingDataProps;
};
