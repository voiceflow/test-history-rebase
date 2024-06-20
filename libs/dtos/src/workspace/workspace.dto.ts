import { z } from 'zod';

import { QuotaDTO } from '@/billing/quota/quota.dto';
import { OrganizationMemberDTO } from '@/organization/organization-member.dto';

import { WorkspaceInvitationDTO } from './workspace-invitation.dto';
import { StripePlanType } from './workspace-stripe-plan-type.enum';
import { StripeStatus } from './workspace-stripe-status.enum';

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
