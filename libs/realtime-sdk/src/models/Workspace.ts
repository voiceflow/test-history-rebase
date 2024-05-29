import { WorkspaceActivationState } from '@realtime-sdk/constants';
import { UserRole } from '@voiceflow/dtos';
import { PlanType } from '@voiceflow/internal';
import { Normalized } from 'normal-store';

import * as Billing from './Billing';

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
  settingsAiAssist?: boolean | null;
  settingsDashboardKanban?: boolean | null;
}

export interface PlanSeatLimits {
  editor: number;
  viewer: number;
}

export type StripeStatus = 'incomplete_expired' | 'incomplete' | 'unpaid' | 'past_due';

export interface Workspace {
  id: string;
  name: string;
  plan: PlanType | null;
  seats: number;
  state: WorkspaceActivationState | null;
  image: string;
  quotas?: Billing.Quota[];
  /**
   * @deprecated Use selector instead of accessing directly, since we are using org level members now
   */
  members: Normalized<WorkspaceMember>;
  created: string;
  projects: number;
  settings: WorkspaceSettings;
  betaFlag?: number | null;
  creatorID: number | null; // workspaces created via identity service do not have creator_id
  planSeatLimits: PlanSeatLimits;
  pendingMembers: Normalized<PendingWorkspaceMember>;
  organizationID: string | null;
  variableStatesLimit: number | null;
  organizationTrialDaysLeft: number | null;
  stripeStatus: StripeStatus;
}

export interface DBWorkspace {
  creator_id: number | null;
  team_id: string;
  stripe_status: StripeStatus;
  name: string;
  created: string;
  seatLimits: PlanSeatLimits;
  organization_id: string | null;
  organization_trial_days_left: number | null;
  image: string;
  projects: number;
  seats: number;
  plan: PlanType | null;
  members: Array<WorkspaceMember | PendingWorkspaceMember>;
  variableStatesLimit: number | null;
  settings: WorkspaceSettings;
  beta_flag?: number | null;
}
