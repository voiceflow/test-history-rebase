import { PlanType } from '@voiceflow/internal';

export const TEAM_PLANS = [PlanType.PRO, PlanType.TEAM, PlanType.OLD_PRO, PlanType.OLD_TEAM] as const;

export const STARTER_PLANS = [PlanType.STUDENT, PlanType.CREATOR, PlanType.STARTER, PlanType.OLD_STARTER] as const;

export const ENTERPRISE_PLANS = [PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE] as const;

export const PLAN_TYPE_META = {
  [PlanType.OLD_STARTER]: {
    label: 'Starter',
    color: 'linear-gradient(to bottom, rgba(141, 162, 181, 0.85), #8da2b5)',
  },
  [PlanType.STARTER]: {
    label: 'Starter',
    color: 'linear-gradient(to bottom, rgba(141, 162, 181, 0.85), #8da2b5)',
  },
  [PlanType.STUDENT]: {
    label: 'Student',
    color: 'linear-gradient(rgb(92, 107, 192, 0.85), #5c6bc0)',
  },
  [PlanType.OLD_PRO]: {
    label: 'Pro',
    color: 'linear-gradient(to bottom, rgba(39, 151, 69, 0.85), #279745)',
  },
  [PlanType.PRO]: {
    label: 'Pro',
    color: 'linear-gradient(to bottom, rgba(39, 151, 69, 0.85), #279745)',
  },
  [PlanType.OLD_ENTERPRISE]: {
    label: 'Enterprise',
    color: 'linear-gradient(rgba(19, 33, 68, 0.85), rgb(19, 33, 68))',
  },
  [PlanType.ENTERPRISE]: {
    label: 'Enterprise',
    color: 'linear-gradient(rgba(19, 33, 68, 0.85), rgb(19, 33, 68))',
  },
  [PlanType.OLD_TEAM]: {
    label: 'Team',
    color: 'linear-gradient(to bottom, rgba(85, 137, 235, 0.85) -25%, #5589eb 75%)',
  },
  [PlanType.TEAM]: {
    label: 'Team',
    color: 'linear-gradient(to bottom, rgba(85, 137, 235, 0.85) -25%, #5589eb 75%)',
  },
  [PlanType.CREATOR]: {
    label: 'Creator',
    color: 'linear-gradient(rgb(92, 107, 192, 0.85), #5c6bc0)',
  },
};
