import { PlanType, UserRole } from '@voiceflow/internal';
import React from 'react';

import { hasPermission, Permission } from '@/config/permissions';
import { IdentityContext, IdentityContextValue } from '@/contexts/IdentityContext';

export const usePermission = (permission?: Permission): [boolean, IdentityContextValue] => {
  const identity = React.useContext(IdentityContext)!;

  const isAllowed =
    !permission || !!(identity.activeRole && identity.activePlan && hasPermission(permission, identity.activeRole, identity.activePlan));

  return [isAllowed, identity];
};

export const useGuestPermission = (activePlan: PlanType, permission: Permission): [boolean] => {
  const isAllowed = !!(activePlan && hasPermission(permission, UserRole.GUEST, activePlan));

  return [isAllowed];
};

export const useIsAdmin = () => {
  const [, { activeRole }] = usePermission();

  return activeRole === UserRole.ADMIN;
};
