import { PlanType, UserRole } from '@voiceflow/internal';
import { Normalized } from 'normal-store';

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
}

export interface DBWorkspaceProperties {
  settingsAiAssist?: boolean | null;
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
  quotas?: Billing.Quota[];
  members: Normalized<WorkspaceMember>;
  created: string;
  projects: number;
  settings: WorkspaceSettings;
  betaFlag: number;
  creatorID: number | null; // workspaces created via identity service do not have creator_id
  hasSource: boolean;
  seatLimits: SeatLimits;
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
