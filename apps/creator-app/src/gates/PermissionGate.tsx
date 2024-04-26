import _isFunction from 'lodash/isFunction';
import type React from 'react';

import type { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';

export interface PermissionGateProps extends React.PropsWithChildren {
  permission: Permission;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ permission, children }) => {
  const [isAllowed, { activeRole }] = usePermission(permission);

  if (!isAllowed) return null;

  return _isFunction(children) ? children({ role: activeRole }) : children;
};

export default PermissionGate;
