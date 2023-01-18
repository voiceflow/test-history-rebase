import _isFunction from 'lodash/isFunction';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';

export interface PermissionGateProps {
  permission: Permission;
}

const PermissionGate: React.OldFC<PermissionGateProps> = ({ permission, children }) => {
  const [isAllowed, { activeRole }] = usePermission(permission);

  if (!isAllowed) return null;

  return _isFunction(children) ? children({ role: activeRole }) : children;
};

export default PermissionGate;
