import { PlanType } from '@voiceflow/internal';

export const PRO_PLANS = [PlanType.PRO, PlanType.OLD_PRO] satisfies PlanType[];

export const TEAM_PLANS = [PlanType.TEAM, PlanType.OLD_TEAM] satisfies PlanType[];

export const STARTER_PLANS = [PlanType.STARTER, PlanType.OLD_STARTER] satisfies PlanType[];

export const PERSONAL_PLANS = [PlanType.STUDENT, PlanType.CREATOR] satisfies PlanType[];

export const ENTERPRISE_PLANS = [PlanType.ENTERPRISE] satisfies PlanType[];

export const ALL_PLANS = [...STARTER_PLANS, ...PERSONAL_PLANS, ...PRO_PLANS, ...TEAM_PLANS, ...ENTERPRISE_PLANS] satisfies PlanType[];

export const PAID_PLANS = [...PERSONAL_PLANS, ...PRO_PLANS, ...TEAM_PLANS, ...ENTERPRISE_PLANS] satisfies PlanType[];

export const PRO_AND_TEAM_PLANS = [...PRO_PLANS, ...TEAM_PLANS] satisfies PlanType[];

export const NON_ENTERPRISE_PAID_PLANS = [...PERSONAL_PLANS, ...PRO_AND_TEAM_PLANS] satisfies PlanType[];

export const TEAM_PLUS_PLANS = [...TEAM_PLANS, ...ENTERPRISE_PLANS] satisfies PlanType[];

export const PRO_PLUS_PLANS = [...PRO_AND_TEAM_PLANS, ...ENTERPRISE_PLANS] satisfies PlanType[];

export const STUDENT_PLUS_PLANS = [PlanType.STUDENT, ...PRO_AND_TEAM_PLANS, ...ENTERPRISE_PLANS] satisfies PlanType[];

export const NON_ENTERPRISE_PLANS = [...STARTER_PLANS, ...PERSONAL_PLANS, ...PRO_AND_TEAM_PLANS] satisfies PlanType[];

export const PLAN_TYPE_META: Record<PlanType, { label: string; color: string }> = {
  [PlanType.OLD_STARTER]: {
    label: 'Free',
    color: 'linear-gradient(to bottom, rgba(141, 162, 181, 0.85), #8da2b5)',
  },
  [PlanType.STARTER]: {
    label: 'Free',
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
