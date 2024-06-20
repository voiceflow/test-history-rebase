import { z } from 'zod';

import { QuotaDTO } from '@/billing/quota.dto';
import { OrganizationMemberDTO } from '@/organization/organization-member.dto';

import { WorkspaceInvitationDTO } from './workspace-invitation.dto';

export enum StripePlanType {
  OLD_STARTER = 'old_starter',
  OLD_PRO = 'old_pro',
  OLD_TEAM = 'old_team',
  STARTER = 'starter',
  STUDENT = 'student',
  PRO = 'pro',
  TEAM = 'team',
  ENTERPRISE = 'enterprise',
  CREATOR = 'creator',
}

export enum StripeStatus {
  CANCELED = 'canceled',
  ACTIVE = 'active',
  UNPAID = 'unpaid',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  INCOMPLETE = 'incomplete',
  PAST_DUE = 'past_due',
}

export enum StripeBillingPeriod {
  MONTHLY = 'MO',
  ANNUALLY = 'YR',
}

export const WorkspaceSettingsDTO = z.object({
  aiAssist: z.boolean().nullable(),
  dashboardKanban: z.boolean().nullable(),
});

export const WorkspaceDTO = z.object({
  id: z.string(),
  name: z.string(),
  plan: z.nativeEnum(StripePlanType),
  seats: z.number(),
  image: z.string().nullable(),

  projects: z.number(),
  betaFlag: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  seatLimits: z.object({ editor: z.number(), viewer: z.number() }),
  stripeStatus: z.nativeEnum(StripeStatus).nullable(),
  organizationID: z.string(),
  stripeCustomerID: z.string().nullable(),
  variableStatesLimit: z.number().nullable(),
  stripeSubscriptionID: z.string().nullable(),
  organizationTrialDaysLeft: z.number().nullable(),

  settings: WorkspaceSettingsDTO.optional(),
  quotas: z.array(QuotaDTO).optional(),
  members: z.array(OrganizationMemberDTO).optional(),
  pendingMembers: z.array(WorkspaceInvitationDTO).optional(),
});

export type Workspace = z.infer<typeof WorkspaceDTO>;
export type WorkspaceSettings = z.infer<typeof WorkspaceSettingsDTO>;
