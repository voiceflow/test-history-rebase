import { PlanType } from '@voiceflow/internal';

import {
  Limits,
  LimitType,
  ToastErrorDynamicLimit,
  ToastErrorValueLimit,
  UpgradeModalDynamicLimit,
  UpgradeModalValueLimit,
} from '@/config/planLimitV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { getPlanLimit } from '@/utils/planLimitV2';

import { useSelector } from './redux';

type InjectedLimit<PlanLimit> = PlanLimit extends ToastErrorDynamicLimit
  ? Omit<ToastErrorDynamicLimit, 'getToastError'> & { value: number; toastError: ReturnType<ToastErrorDynamicLimit['getToastError']> }
  : PlanLimit extends UpgradeModalDynamicLimit
  ? Omit<UpgradeModalDynamicLimit, 'getUpgradeModal'> & { value: number; upgradeModal: ReturnType<UpgradeModalDynamicLimit['getUpgradeModal']> }
  : never;

type WithLimitValueOption<Limit extends LimitType> = {
  type: Limit;
} & (NonNullable<Limits[Limit][PlanType]> extends ToastErrorValueLimit | UpgradeModalValueLimit ? { limit?: never } : { limit: number });

export const usePlanLimit = <Limit extends LimitType>({
  type,
  limit = 0,
}: WithLimitValueOption<Limit>): InjectedLimit<NonNullable<Limits[Limit][PlanType]>> | null => {
  const activePlan = useSelector(WorkspaceV2.active.planSelector) ?? PlanType.STARTER;

  const planLimit = getPlanLimit(type, activePlan);

  if (!planLimit) return null;

  const planLimitValue = 'value' in planLimit ? planLimit.value : limit;

  if ('getToastError' in planLimit) {
    return {
      ...(planLimit as any),
      value: planLimitValue,
      toastError: planLimit.getToastError({ limit: planLimitValue, plan: activePlan }),
    };
  }

  if ('getUpgradeModal' in planLimit) {
    return {
      ...(limit as any),
      value: planLimitValue,
      upgradeModal: planLimit.getUpgradeModal({ limit: planLimitValue, plan: activePlan }),
    };
  }

  return null;
};

type LimitedOptions<Limit extends LimitType> = WithLimitValueOption<Limit> & { value?: number };

export const usePlanLimited = <Limit extends LimitType>({
  value = 0,
  ...limitOptions
}: LimitedOptions<Limit>): InjectedLimit<NonNullable<Limits[Limit][PlanType]>> | null => {
  const planLimit = usePlanLimit<Limit>(limitOptions as WithLimitValueOption<Limit>);

  if (!planLimit) return null;

  return planLimit && value >= planLimit.value ? planLimit : null;
};

type LimitedActionOptions<Limit extends LimitType, Args extends any[] = []> = LimitedOptions<Limit> & {
  onAction: (...args: Args) => void;
  onLimited: (limit: InjectedLimit<NonNullable<Limits[Limit][PlanType]>>) => void;
};

export const usePlanLimitedAction = <Limit extends LimitType, Args extends any[] = void[]>({
  onAction,
  onLimited,
  ...limitedOptions
}: LimitedActionOptions<Limit, Args>): ((...args: Args) => void) => {
  const limit = usePlanLimited<Limit>(limitedOptions as LimitedOptions<Limit>);

  return (...args: Args) => {
    if (limit) {
      onLimited(limit);
    } else {
      onAction(...args);
    }
  };
};
