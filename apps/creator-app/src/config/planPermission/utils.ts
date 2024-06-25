import type { AnyPlanPermission } from './types';

type PlanPermissionRecord<P extends AnyPlanPermission<any>> = { [K in P['permission']]: Extract<P, { permission: K }> };

export const buildPlanPermissionRecord = <P extends AnyPlanPermission<any>>(
  permissions: ReadonlyArray<P>
): PlanPermissionRecord<P> =>
  Object.fromEntries(permissions.map((config) => [config.permission, config])) as PlanPermissionRecord<P>;
