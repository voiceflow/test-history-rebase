import { PlanType } from '@voiceflow/internal';
import React from 'react';

import type { LimitType } from '@/constants/limits';
import * as Organization from '@/ducks/organization';
import type { PlanLimitConfig } from '@/utils/planLimitV3.util';
import { getLimitConfig, getLimitEntitlement, isStaticLimitConfig } from '@/utils/planLimitV3.util';

import { useSelector } from './redux';

// @deprecated use useConditionalLimit instead
export const usePlanLimitedConfig = () => {};

// @deprecated use useGetConditionalLimit instead
export const useGetPlanLimitedConfig = () => {};

type PlanLimitData<Limit extends LimitType> = PlanLimitConfig<Limit> & {
  limit: number;
  payload: { limit: number; maxLimit: number };
};

export const useLimitConfig = <Limit extends LimitType>(limitType: Limit): PlanLimitData<Limit> | null => {
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const activePlan = (subscription?.plan as PlanType) ?? PlanType.STARTER;
  const limitConfig = React.useMemo(() => getLimitConfig(limitType, activePlan), [limitType, activePlan]);
  const entitlementLimit = React.useMemo(() => {
    const entitlement = getLimitEntitlement(limitType);
    if (!entitlement || !subscription) return null;

    return subscription.entitlements[entitlement] ?? null;
  }, [limitType, subscription]);

  return React.useMemo(() => {
    if (!limitConfig) return null;

    return {
      ...limitConfig,
      ...(isStaticLimitConfig(limitConfig)
        ? {
            limit: limitConfig.limit,
            payload: {
              limit: limitConfig.limit,
              // FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994 only to backward compatibility, use limit instead
              maxLimit: limitConfig.limit,
            },
          }
        : {
            limit: entitlementLimit,
            payload: {
              limit: entitlementLimit,
              // FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994 only to backward compatibility, use limit instead
              maxLimit: entitlementLimit,
            },
          }),
    } as PlanLimitData<Limit>;
  }, [entitlementLimit, limitConfig]);
};

interface ConditionalLimitOptions {
  value: number;
  greaterOnly?: boolean;
}

export const useGetConditionalLimit = <Limit extends LimitType>(limitType: Limit) => {
  const config = useLimitConfig(limitType);

  return React.useCallback(
    ({ value, greaterOnly }: ConditionalLimitOptions) => {
      if (config === null) return null;

      if (greaterOnly) return value > config.limit ? config : null;

      return value >= config.limit ? config : null;
    },
    [config]
  );
};

export const useConditionalLimit = <Limit extends LimitType>(limitType: Limit, options: ConditionalLimitOptions) => {
  const getConditionalLimit = useGetConditionalLimit(limitType);

  return React.useMemo(() => getConditionalLimit(options), [getConditionalLimit, options.greaterOnly, options.value]);
};

interface PlanLimitedActions<Limit extends LimitType, Args extends any[] = []> {
  /**
   * the callback is called if the limit is reached
   */
  onLimit: (config: PlanLimitData<Limit>) => void;

  /**
   * the callback is called if the limit is not reached
   */
  onAction: (...args: Args) => void;
}

type PlanLimitedActionOptions<Limit extends LimitType, Args extends any[] = []> = PlanLimitedActions<Limit, Args> &
  ConditionalLimitOptions;

export const useConditionalLimitAction = <Limit extends LimitType, Args extends any[] = void[]>(
  limitType: Limit,
  { onLimit, onAction, ...limitedOptions }: PlanLimitedActionOptions<Limit, Args>
): ((...args: Args) => void) => {
  const config = useConditionalLimit(limitType, limitedOptions as any);

  return (...args: Args) => {
    if (config) {
      onLimit(config);
    } else {
      onAction(...args);
    }
  };
};
