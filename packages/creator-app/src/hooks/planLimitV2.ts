import { PlanType } from '@voiceflow/internal';

import { Limits, LimitType } from '@/config/planLimitV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { getPlanLimit } from '@/utils/planLimitV2';

import { useSelector } from './redux';

export const useLimit = <Limit extends LimitType>(limitType: Limit): NonNullable<Limits[Limit][PlanType]> | null => {
  const activePlan = useSelector(WorkspaceV2.active.planSelector);

  return getPlanLimit(limitType, activePlan ?? PlanType.STARTER);
};

export const useLimited = <Limit extends LimitType>(limitType: Limit, currentValue = 0): NonNullable<Limits[Limit][PlanType]> | null => {
  const limit = useLimit(limitType);

  return limit && currentValue >= limit.value ? limit : null;
};

export const useLimitedAction = <Limit extends LimitType, Args extends any[] = void[]>({
  type,
  value,
  onAction,
  onLimited,
}: {
  type: Limit;
  value?: number;
  onAction: (...args: Args) => void;
  onLimited: (limit: NonNullable<Limits[Limit][PlanType]>) => void;
}): ((...args: Args) => void) => {
  const limit = useLimited(type, value);

  return (...args: Args) => {
    if (limit) {
      onLimited(limit);
    } else {
      onAction(...args);
    }
  };
};
