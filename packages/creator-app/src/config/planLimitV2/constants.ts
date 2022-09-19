import { PlanType } from '@voiceflow/internal';

export enum LimitType {
  DOMAINS = 'DOMAINS',
  PROJECTS = 'PROJECTS',
  MARKUP_IMAGE = 'MARKUP_IMAGE',
  MARKUP_VIDEO = 'MARKUP_VIDEO',
}

export const TEAM_LIMIT_PLANS = [PlanType.PRO, PlanType.TEAM, PlanType.OLD_PRO, PlanType.OLD_TEAM] as const;

export const STARTER_LIMIT_PLANS = [PlanType.STUDENT, PlanType.CREATOR, PlanType.STARTER, PlanType.OLD_STARTER] as const;

export const ENTERPRISE_LIMIT_PLANS = [PlanType.ENTERPRISE, PlanType.OLD_ENTERPRISE] as const;
