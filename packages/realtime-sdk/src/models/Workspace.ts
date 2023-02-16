import { PlanType, UserRole } from '@voiceflow/internal';
import { Normalized } from 'normal-store';

import * as Billing from './Billing';
import { DBProjectList } from './ProjectList';

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
  image: string;
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

export interface SeatLimits {
  editor: number;
  viewer: number;
}

export type StripeStatus = 'incomplete_expired' | 'incomplete' | 'unpaid' | 'past_due';

export type WorkspaceActivationState = 'LOCKED' | 'WARNING';

export interface Workspace {
  id: string;
  name: string;
  plan: PlanType | null;
  seats: number;
  state: WorkspaceActivationState | null;
  image: string;
  quotas?: Billing.Quota[];
  members: Normalized<WorkspaceMember>;
  created: string;
  projects: number;
  settings: WorkspaceSettings;
  betaFlag: number;
  creatorID: number | null; // workspaces created via identity service do not have creator_id
  hasSource: boolean;
  seatLimits: SeatLimits;
  /** @deprecated exists for older FE clients remove after cached cleared, use projectLists instead */
  boards: DBProjectList[];
  projectLists: DBProjectList[];
  pendingMembers: Normalized<PendingWorkspaceMember>;
  organizationID: string | null;
  variableStatesLimit: number | null;
  organizationTrialDaysLeft: number | null;
}

export interface DBWorkspace {
  creator_id: number | null;
  team_id: string;
  stripe_status: StripeStatus;
  name: string;
  created: string;
  seatLimits: SeatLimits;
  hasSource: boolean;
  organization_id: string | null;
  organization_trial_days_left: number | null;
  image: string;
  projects: number;
  seats: number;
  plan: PlanType | null;
  members: Array<WorkspaceMember | PendingWorkspaceMember>;
  beta_flag: number;
  project_lists: DBProjectList[];
  variableStatesLimit: number | null;
  settings: WorkspaceSettings;
}
