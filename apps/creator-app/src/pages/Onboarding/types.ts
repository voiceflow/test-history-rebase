import { UserRole } from '@voiceflow/dtos';

export interface CollaboratorType {
  email: string;
  permission: UserRole;
}

export interface OnboardingDataProps {
  collaborators: CollaboratorType[];
}

export interface OnboardingStepProps {
  data: OnboardingDataProps;
}

export enum TeamSizeType {
  INDIVIDUAL = 'individual',
  SMALL = 'small',
  LARGE = 'large',
}
