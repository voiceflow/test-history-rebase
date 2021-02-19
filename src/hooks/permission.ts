import React from 'react';

import { hasPermission, Permission } from '@/config/permissions';
import { IdentityContext, IdentityContextValue } from '@/contexts';

// eslint-disable-next-line import/prefer-default-export
export const usePermission = (permission?: Permission): [boolean, IdentityContextValue] => {
  const identity = React.useContext(IdentityContext)!;

  const isAllowed =
    !permission || !!(identity.activeRole && identity.activePlan && hasPermission(permission, identity.activeRole, identity.activePlan));

  return [isAllowed, identity];
};
