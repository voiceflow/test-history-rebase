import type { PlanType } from '@voiceflow/internal';

import type {
  BaseStaticLimit,
  EntitlementLimitDef,
  EntitlementType,
  LimitKey,
  Limits,
  LimitV3,
} from '@/config/planLimitV3';
import { LIMITS } from '@/config/planLimitV3';
import type { LimitType } from '@/constants/limits';

export type PlanLimitConfig<L extends LimitType> = L extends LimitKey
  ? Limits[L]['limits'][keyof Limits[L]['limits']]
  : never;

export type PlanLimitDefinition<L extends LimitType> = L extends LimitKey ? PlanLimitConfig<L> : never;

export const isSupportedLimit = (limit: LimitType): limit is LimitKey => limit in LIMITS;

export const isEntitlementLimitDef = (config: LimitV3): config is EntitlementLimitDef => 'entitlement' in config;
export const isStaticLimitConfig = (config: any): config is BaseStaticLimit => !!config && 'limit' in config;

/**
 * returns plan permission config, `null` if permission is not supported or permission is allowed for the plan
 */
export const getLimitConfig = <L extends LimitType>(limit: L, plan: PlanType): PlanLimitConfig<L> | null => {
  if (!isSupportedLimit(limit)) return null;

  const limits = LIMITS[limit]?.limits;

  return (limits?.[plan as keyof typeof limits] as PlanLimitConfig<L>) || null;
};

export const getLimitEntitlement = <L extends LimitType>(limit: L): EntitlementType | null => {
  if (!isSupportedLimit(limit)) return null;

  const config = LIMITS[limit];
  if (isEntitlementLimitDef(config)) {
    return config.entitlement;
  }
  return null;
};
