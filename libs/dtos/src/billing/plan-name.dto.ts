import { z } from 'zod';

export const PlanName = {
  STARTER: 'starter',
  PRO: 'pro',
  TEAM: 'team',
  ENTERPRISE: 'enterprise',
} as const;

export const PlanNameDTO = z.nativeEnum(PlanName);

export type PlanName = (typeof PlanName)[keyof typeof PlanName];
