import _ from 'lodash';

import { usePermissions } from '@/contexts/RolePermissionsContext';

function RolePermissionGate({ featureId, children }) {
  const [canUse, role] = usePermissions(featureId);
  const renderChildren = _.isFunction(children) ? children({ role }) : children;
  return canUse ? renderChildren : null;
}

export default RolePermissionGate;
