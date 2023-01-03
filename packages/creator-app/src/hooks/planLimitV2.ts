import { PlanType } from '@voiceflow/internal';

import {
  AnyLimit,
  Limits,
  LimitType,
  ToastErrorDynamicLimit,
  ToastErrorStaticLimit,
  UpgradeModalDynamicLimit,
  UpgradeModalStaticLimit,
} from '@/config/planLimitV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { getPlanLimit } from '@/utils/planLimitV2';

import { useSelector } from './redux';

type InjectedLimit<PlanLimit> = PlanLimit extends ToastErrorDynamicLimit
  ? Omit<ToastErrorDynamicLimit, 'getToastError'> & { limit: number; toastError: ReturnType<ToastErrorDynamicLimit['getToastError']> }
  : PlanLimit extends UpgradeModalDynamicLimit
  ? Omit<UpgradeModalDynamicLimit, 'getUpgradeModal'> & { limit: number; upgradeModal: ReturnType<UpgradeModalDynamicLimit['getUpgradeModal']> }
  : never;

type WithLimitValueOption<Limit extends LimitType> = {
  type: Limit;
} & (NonNullable<Limits[Limit][PlanType]> extends ToastErrorStaticLimit | UpgradeModalStaticLimit ? { limit?: never } : { limit: number });

export const usePlanLimit = <Limit extends LimitType>({
  type,
  limit = 0,
}: WithLimitValueOption<Limit>): InjectedLimit<NonNullable<Limits[Limit][PlanType]>> | null => {
  const activePlan = useSelector(WorkspaceV2.active.planSelector) ?? PlanType.STARTER;

  // FIXME: TS 4.9 is not able to infer the type of planLimit correctly, so we need to cast it to AnyLimit
  // remove the cast when TS issue is fixed
  const planLimit = getPlanLimit(type, activePlan) as AnyLimit | null;

  if (!planLimit) return null;

  const planLimitValue = 'limit' in planLimit ? planLimit.limit : limit;

  const rendererOptions = { limit: planLimitValue, increasableLimit: planLimit.increasableLimit };

  if ('getToastError' in planLimit) {
    return {
      ...(planLimit as any),
      limit: planLimitValue,
      toastError: planLimit.getToastError(rendererOptions),
    };
  }

  if ('getUpgradeModal' in planLimit) {
    return {
      ...(planLimit as any),
      limit: planLimitValue,
      upgradeModal: planLimit.getUpgradeModal(rendererOptions),
    };
  }

  return null;
};

interface PlanLimitedOptions {
  value?: number;
}

export const useGetPlanLimited = <Limit extends LimitType>(
  limitOptions: LimitedOptions<Limit>
): ((options: PlanLimitedOptions) => InjectedLimit<NonNullable<Limits[Limit][PlanType]>> | null) => {
  const planLimit = usePlanLimit<Limit>(limitOptions as WithLimitValueOption<Limit>);

  if (!planLimit) return () => null;

  return ({ value = 0 }) => (planLimit && value >= planLimit.limit ? planLimit : null);
};

type LimitedOptions<Limit extends LimitType> = WithLimitValueOption<Limit> & PlanLimitedOptions;

export const usePlanLimited = <Limit extends LimitType>(
  limitOptions: LimitedOptions<Limit>
): InjectedLimit<NonNullable<Limits[Limit][PlanType]>> | null => {
  const getPlanLimited = useGetPlanLimited<Limit>(limitOptions);

  return getPlanLimited(limitOptions);
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
