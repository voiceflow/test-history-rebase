import { PlanType } from '@voiceflow/internal';
import React from 'react';

import { BaseStaticLimit } from '@/config/planLimitV2';
import { LimitType } from '@/constants/limits';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { getPlanLimitConfig, PlanLimitConfig } from '@/utils/planLimitV2';

import { useSelector } from './redux';

type PlanLimitConfigOptions<Limit extends LimitType> = PlanLimitConfig<Limit> extends BaseStaticLimit ? [] : [{ limit: number }];

export type PlanLimitData<Limit extends LimitType> = PlanLimitConfig<Limit> & {
  limit: number;
  payload: { limit: number; maxLimit?: number };
};

export const usePlanLimitConfig = <Limit extends LimitType>(
  limitType: Limit,
  ...options: PlanLimitConfigOptions<Limit>
): PlanLimitData<Limit> | null => {
  const [{ limit = 0 } = {}] = options;
  const activePlan = useSelector(WorkspaceV2.active.planSelector) ?? PlanType.STARTER;

  const planLimit = React.useMemo(() => getPlanLimitConfig(limitType, activePlan), [limitType, activePlan]);

  const maxLimit = useSelector((state) => planLimit && ('maxLimitSelector' in planLimit ? planLimit.maxLimitSelector?.(state) : undefined));

  return React.useMemo(() => {
    if (!planLimit) return null;

    const planLimitValue = 'limit' in planLimit ? planLimit.limit : limit;

    return {
      ...planLimit,
      limit: planLimitValue,
      payload: { limit: planLimitValue, maxLimit },
    } as PlanLimitData<Limit>;
  }, [limit, maxLimit, planLimit]);
};

interface PlanLimitedOptions {
  value?: number;
  greaterOnly?: boolean;
}

export const useGetPlanLimitedConfig = <Limit extends LimitType>(
  limitType: Limit,
  ...options: PlanLimitConfigOptions<Limit>
): ((options?: PlanLimitedOptions) => PlanLimitData<Limit> | null) => {
  const planLimit = usePlanLimitConfig(limitType, ...options);

  return React.useCallback(
    ({ value = 0, greaterOnly } = {}) => {
      if (!planLimit) return null;

      if (greaterOnly) return value > planLimit.limit ? planLimit : null;

      return value >= planLimit.limit ? planLimit : null;
    },
    [planLimit]
  );
};

type PlanLimitedConfigOptions<Limit extends LimitType> = PlanLimitConfig<Limit> extends BaseStaticLimit
  ? [] | [PlanLimitedOptions]
  : [PlanLimitedOptions & BaseStaticLimit];

export const usePlanLimitedConfig = <Limit extends LimitType>(
  limitType: Limit,
  ...options: PlanLimitedConfigOptions<Limit>
): PlanLimitData<Limit> | null => {
  const getPlanLimited = useGetPlanLimitedConfig<Limit>(limitType, ...(options as PlanLimitConfigOptions<Limit>));

  return getPlanLimited(options[0]);
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
  PlanLimitedOptions &
  (PlanLimitConfig<Limit> extends BaseStaticLimit ? unknown : BaseStaticLimit);

export const usePlanLimitedAction = <Limit extends LimitType, Args extends any[] = void[]>(
  limitType: Limit,
  { onLimit, onAction, ...limitedOptions }: PlanLimitedActionOptions<Limit, Args>
): ((...args: Args) => void) => {
  const config = usePlanLimitedConfig<Limit>(limitType, limitedOptions as any);

  return (...args: Args) => {
    if (config) {
      onLimit(config);
    } else {
      onAction(...args);
    }
  };
};
