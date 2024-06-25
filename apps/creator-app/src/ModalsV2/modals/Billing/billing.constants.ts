import { PlanName } from '@voiceflow/dtos';

export const MAX_SEATS = {
  [PlanName.TEAM]: 5,
  [PlanName.PRO]: 2,
  [PlanName.STARTER]: 1,
  [PlanName.ENTERPRISE]: 5,
};

export const DEFAULT_SEATS = {
  [PlanName.TEAM]: 3,
  [PlanName.PRO]: 1,
  [PlanName.STARTER]: 1,
  [PlanName.ENTERPRISE]: 1,
};
