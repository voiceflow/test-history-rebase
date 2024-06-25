import type { AnyRolePermission } from './types';

type RolePermissionRecord<P extends AnyRolePermission<any>> = { [K in P['permission']]: Extract<P, { permission: K }> };

export const buildRolePermissionRecord = <P extends AnyRolePermission<any>>(
  permissions: ReadonlyArray<P>
): RolePermissionRecord<P> =>
  Object.fromEntries(permissions.map((permission) => [permission.permission, permission])) as RolePermissionRecord<P>;
