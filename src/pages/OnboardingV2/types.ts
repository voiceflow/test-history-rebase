import { UserRole } from '@/constants';

export type CollaboratorType = { email: string; permission?: UserRole };

export type OnboardingProps = { data: CollaboratorType; location?: any };
