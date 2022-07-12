import { PlanType, UserRole } from '@voiceflow/internal';

export interface Board {
  name: string;
  board_id: string;
  projects: string[];
}

export interface Member {
  creator_id: number | null;
  seats: number;
  name: string | null;
  email: string;
  role: UserRole;
  image: string | null;
  created: string;
  /**
   * don't see these two properties being used
   * it would be great if we have invite property boolean enabled
   * to indicate user is invited but has not yet accepted
   */
  status: unknown;
  invite?: string;
}

export interface DBMember extends Member {
  creator_id: number;
  name: string;
  image: string;
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
  boards: Board[];
  created: string;
  seatLimits: SeatLimits;
  creatorID: number;
  hasSource: boolean;
  image: string;
  projects: number;
  seats: number;
  plan: PlanType | null;
  members: DBMember[];
  state: WorkspaceActivationState | null;
  betaFlag: number;
  organizationID: string | null;
  organizationTrialDaysLeft: number | null;
  variableStatesLimit: number | null;
}

export interface DBWorkspace {
  creator_id: number;
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
  members: DBMember[];
  beta_flag: number;
  variableStatesLimit: number | null;
}
