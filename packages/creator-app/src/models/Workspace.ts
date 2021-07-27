import { PlanType, UserRole } from '@voiceflow/internal';

export interface Workspace {
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
}

export namespace Workspace {
  export type ActivationState = 'LOCKED' | 'WARNING';

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
}

export interface DBWorkspace {
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
}

export namespace DBWorkspace {
  export interface Board {
    board_id: string;
    name: string;
    projects: string[];
  }

  export interface Member {
    creator_id: number;
    seats: number;
    name: string;
    email: string;
    role: UserRole;
    image: string;
    created: string;
    status: unknown;
    invite?: string;
  }
}

export interface SeatLimits {
  editor: number;
  viewer: number;
}

export type StripeStatus = 'incomplete_expired' | 'incomplete' | 'unpaid' | 'past_due';
