import { PlanType } from '@voiceflow/internal';

import { Permission } from '@/config/permissions';
import { getPlanPermission, PlanPermission } from '@/utils/planPermission';

import { usePermission } from './permission';

export const usePlanPermission = <P extends Permission>(permission: P | null): PlanPermission<P> | null => {
  const [isAllowed, identity] = usePermission(permission);

  if (isAllowed || !permission) return null;

  return getPlanPermission<P>(permission, identity.activePlan ?? PlanType.STARTER) as PlanPermission<P> | null;
};

interface PlanPermissionActionOptions<P extends Permission, Args extends any[] = []> {
  onAction: (...args: Args) => void;
  onLimited: (limit: PlanPermission<P>) => void;
  permission: P;
}

export const usePlanPermissionAction = <P extends Permission, Args extends any[] = []>({
  onAction,
  onLimited,
  permission,
}: PlanPermissionActionOptions<P, Args>): ((...args: Args) => void) => {
  const limit = usePlanPermission<P>(permission);

  return (...args: Args) => {
    if (limit) {
      onLimited(limit);
    } else {
      onAction(...args);
    }
  };
};
