import { PlanType, UserRole } from '@voiceflow/internal';

export interface Board {
  name: string;
  board_id: string;
  projects: string[];
}

export interface PendingMember {
  creator_id: number | null;
  name: string | null;
  role: UserRole;
  email: string;
  image: string | null;
  created: string;
}

export interface Member extends PendingMember {
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
  plan: PlanType | null;
  seats: number;
  state: WorkspaceActivationState | null;
  image: string;
  boards: Board[];
  members: Array<PendingMember | Member>;
  created: string;
  projects: number;
  betaFlag: number;
  creatorID: number;
  hasSource: boolean;
  seatLimits: SeatLimits;
  organizationID: string | null;
  variableStatesLimit: number | null;
  organizationTrialDaysLeft: number | null;
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
  members: Array<PendingMember | Member>;
  beta_flag: number;
  variableStatesLimit: number | null;
}
