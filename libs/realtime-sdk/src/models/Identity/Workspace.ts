import { PlanType } from '@voiceflow/internal';

import { PlanSeatLimits, StripeStatus } from '../Workspace';
import { WorkspaceMember } from './WorkspaceMember';

export interface Workspace {
  id: string;
  organizationID: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  image: string;
  members?: WorkspaceMember[];
  betaFlag?: number | null;
}

export interface WorkspaceCombined extends Workspace {
  createdBy: number | null;
  stripeStatus: StripeStatus;
  name: string;
  seatLimits: PlanSeatLimits;
  organizationTrialDaysLeft: number | null;
  image: string;
  projects: number;
  seats: number;
  plan: PlanType | null;
  variableStatesLimit: number | null;
}
