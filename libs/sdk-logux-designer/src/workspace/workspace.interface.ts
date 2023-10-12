import type { Normalized } from '@voiceflow/common';
import type { PlanType } from '@voiceflow/internal';

import type { BaseResource } from '@/common';

import type { WorkspaceActivationStatus } from './workspace-activation-status.enum';
import type { WorkspaceInvite } from './workspace-invite/workspace-invite.interface';
import type { WorkspaceMember } from './workspace-member/workspace-member.interface';
import type { WorkspaceQuota } from './workspace-quota/workspace-quota.interface';
import type { WorkspaceSettings } from './workspace-settings/workspace-settings.interface';

export interface WorkspaceEntitlements {
  seats: number;
  assistants: number;
}

export interface WorkspacePlanLimits {
  editorSeats: number;
  viewerSeats: number;
}

export interface Workspace extends BaseResource {
  name: string;
  plan: PlanType | null;
  image: string | null;
  /**
   * normalization key is quota name
   */
  quotas: Normalized<WorkspaceQuota>;
  members: Normalized<WorkspaceMember>;
  invites: Normalized<WorkspaceInvite>;
  settings: WorkspaceSettings;
  createdAt: string;
  planLimits: WorkspacePlanLimits;
  entitlements: WorkspaceEntitlements;
  organizationID: string;
  activationStatus: WorkspaceActivationStatus | null;
}
