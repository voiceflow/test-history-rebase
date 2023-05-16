import { PlanType } from '@voiceflow/internal';

import { SeatLimits, StripeStatus } from '../Workspace';
import { WorkspaceMember } from './WorkspaceMember';

export interface Workspace {
  id: string;
  organizationID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  image: string;
  members?: WorkspaceMember[];
}

export interface WorkspaceCombined extends Workspace {
  createdBy: number | null;
  stripeStatus: StripeStatus;
  name: string;
  seatLimits: SeatLimits;
  hasSource: boolean;
  organizationTrialDaysLeft: number | null;
  image: string;
  projects: number;
  seats: number;
  plan: PlanType | null;
  betaFlag: number;
  variableStatesLimit: number | null;
}
