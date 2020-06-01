import { PlanType, UserRole } from '@/constants';

export type Workspace = {
  id: string;
  name: string;
  boards: DBWorkspace.Board[];
  created: string;
  seatLimits: SeatLimits;
  creatorID: number;
  hasSource: boolean;
  image: string;
  projects: number;
  seats: number;
  plan: PlanType | null;
  members: DBWorkspace.Member[];
  state: Workspace.ActivationState | null;
  betaFlag: number;
  templates: boolean;
};

export namespace Workspace {
  export type ActivationState = 'LOCKED' | 'WARNING';
}

export type DBWorkspace = {
  creator_id: number;
  team_id: string;
  stripe_status: StripeStatus;
  name: string;
  boards: DBWorkspace.Board[];
  created: string;
  seatLimits: SeatLimits;
  hasSource: boolean;
  image: string;
  projects: number;
  seats: number;
  plan: PlanType | null;
  members: DBWorkspace.Member[];
  beta_flag: number;
  templates: boolean;
};

export namespace DBWorkspace {
  export type Board = {
    board_id: string;
    name: string;
    projects: string[];
  };

  export type Member = {
    creator_id: number;
    seats: number;
    name: string;
    email: string;
    role: UserRole;
    image: string;
    created: string;
    status: unknown;
    invite?: string;
  };
}

export type SeatLimits = {
  editor: number;
  viewer: number;
};

export type StripeStatus = 'incomplete_expired' | 'incomplete' | 'unpaid' | 'past_due';
