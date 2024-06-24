import { PlanName } from '@voiceflow/dtos';

export const MAX_SEATS = {
  [PlanName.TEAM]: 5,
  [PlanName.PRO]: 10,
  [PlanName.STARTER]: 1,
  [PlanName.ENTERPRISE]: 5,
};
