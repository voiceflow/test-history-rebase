import type { WorkspaceActivationState } from '@realtime-sdk/constants';
import type { StripeStatus, UserRole } from '@voiceflow/dtos';
import type { PlanType } from '@voiceflow/internal';
import type { Normalized } from 'normal-store';

import type * as Billing from './Billing';

export interface BaseWorkspaceMember {
  role: UserRole;
  email: string;
}

export interface PendingWorkspaceMember extends BaseWorkspaceMember {
  name: null;
  image: null;
  expiry: string;
  created: null;
  // TODO: refactor to creatorID
  creator_id: null;
}

export interface WorkspaceMember extends BaseWorkspaceMember {
  name: string;
  image: string | null;
  created: string;
  // TODO: refactor to creatorID
  creator_id: number;
}

export type AnyWorkspaceMember = WorkspaceMember | PendingWorkspaceMember;

export interface WorkspaceSettings {
  aiAssist?: boolean | null;
  dashboardKanban?: boolean | null;
}

export interface DBWorkspaceProperties {
  settingsAiAssist?: boolean;
  settingsDashboardKanban?: boolean;
}

export interface PlanSeatLimits {
  editor: number;
  viewer: number;
}

export interface Workspace {
  id: string;
  name: string;
  plan: PlanType | null;
  seats: number;
  state: WorkspaceActivationState | null;
  image: string | null;
  quotas?: Billing.Quota[];
  members: Normalized<WorkspaceMember>;
  created: string;
  projects: number;
  settings: WorkspaceSettings;
  betaFlag?: number | null;
  planSeatLimits: PlanSeatLimits;
  pendingMembers: Normalized<PendingWorkspaceMember>;
  organizationID: string | null;
  variableStatesLimit: number | null;
  organizationTrialDaysLeft: number | null;
  stripeStatus: StripeStatus | null;
}

export interface DBWorkspace {
  team_id: string;
  stripe_status: StripeStatus | null;
  name: string;
  created: string;
  seatLimits: PlanSeatLimits;
  organization_id: string | null;
  organization_trial_days_left: number | null;
  image: string | null;
  projects: number;
  seats: number;
  plan: PlanType | null;
  members: Array<WorkspaceMember | PendingWorkspaceMember>;
  variableStatesLimit: number | null;
  settings: WorkspaceSettings;
  beta_flag?: number | null;
}
