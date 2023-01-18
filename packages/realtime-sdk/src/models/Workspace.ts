import { PlanType, UserRole } from '@voiceflow/internal';

import * as Billing from './Billing';

export interface Board {
  name: string;
  board_id: string;
  projects: string[];
}

export interface PendingWorkspaceMember {
  creator_id: number | null;
  name: string | null;
  role: UserRole;
  email: string;
  image: string | null;
  created: string;
}

export interface WorkspaceMember extends PendingWorkspaceMember {
  name: string;
  image: string;
  creator_id: number;
}

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
  boards: Board[];
  members: Array<WorkspaceMember | PendingWorkspaceMember>;
  created: string;
  projects: number;
  betaFlag: number;
  creatorID: number | null; // workspaces created via identity service do not have creator_id
  hasSource: boolean;
  seatLimits: SeatLimits;
  organizationID: string | null;
  variableStatesLimit: number | null;
  organizationTrialDaysLeft: number | null;
  quotas?: Billing.Quota[];
  settings: WorkspaceSettings;
}

export interface IdentityWorkspace {
  id: string;
  organizationID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  image: string;
}

export interface DBWorkspace {
  creator_id: number | null;
  team_id: string;
  stripe_status: StripeStatus;
  name: string;
  boards: Board[];
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
  variableStatesLimit: number | null;
  settings: WorkspaceSettings;
}
