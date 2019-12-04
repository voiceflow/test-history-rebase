import React from 'react';

import { FEATURE_IDS } from '@/constants';
import { usePermissions } from '@/contexts/RolePermissionsContext';
import { withContext } from '@/hocs';

export const EditPermissionContext = React.createContext(null);
export const { Consumer: EditPermissionConsumer } = EditPermissionContext;

export const EditPermissionProvider = ({ isTesting, children }) => {
  const [canEditCanvas] = usePermissions(FEATURE_IDS.EDIT_CANVAS);
  const canEdit = canEditCanvas && !isTesting;

  return <EditPermissionContext.Provider value={{ isViewer: !canEditCanvas, isTesting, canEdit }}>{children}</EditPermissionContext.Provider>;
};

export const withEditPermission = withContext(EditPermissionContext, 'editPermission');
