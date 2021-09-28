import { PlanType, UserRole } from '@voiceflow/internal';
import React from 'react';

import { hasPermission, Permission } from '@/config/permissions';
import { IdentityContext, IdentityContextValue } from '@/contexts/IdentityContext';

const checkPermission = (identity: IdentityContextValue, permission?: Permission) =>
  !permission || !!(identity.activeRole && identity.activePlan && hasPermission(permission, identity.activeRole, identity.activePlan));

export const usePermission = (permission?: Permission): [boolean, IdentityContextValue] => {
  const identity = React.useContext(IdentityContext)!;

  const isAllowed = checkPermission(identity, permission);

  return [isAllowed, identity];
};

export const useHasPermissions = (): ((permissions?: Permission[]) => boolean) => {
  const identity = React.useContext(IdentityContext)!;

  return React.useCallback(
    (permissions?: Permission[]) => !permissions || permissions.every((permission) => checkPermission(identity, permission)),
    [identity]
  );
};

export const useGuestPermission = (activePlan: PlanType, permission: Permission): [boolean] => {
  const isAllowed = !!(activePlan && hasPermission(permission, UserRole.GUEST, activePlan));

  return [isAllowed];
};

export const useIsAdmin = () => {
  const [, { activeRole }] = usePermission();

  return activeRole === UserRole.ADMIN;
};
