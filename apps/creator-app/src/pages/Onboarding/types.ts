import { UserRole } from '@voiceflow/internal';

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

export enum CreatingForType {
  CHAT = 'CHAT',
  VOICE = 'VOICE',
  BOTH = 'BOTH',
}

export enum TeamGoalType {
  HANDOFF = 'handoff',
  PUBLISH = 'publish',
}

export enum TeamSizeType {
  INDIVIDUAL = 'individual',
  SMALL = 'small',
  LARGE = 'large',
}
