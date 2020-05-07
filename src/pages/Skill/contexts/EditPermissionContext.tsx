import React from 'react';

import { FEATURE_IDS } from '@/constants';
import { usePermissions } from '@/contexts';
import { withContext } from '@/hocs';

type EditPermissionValue = {
  isViewer: boolean;
  isPrototyping: boolean;
  canEdit: boolean;
};

export const EditPermissionContext = React.createContext<EditPermissionValue | null>(null);
export const { Consumer: EditPermissionConsumer } = EditPermissionContext;

export type EditPermissionProviderProps = {
  isPrototyping: boolean;
};

export const EditPermissionProvider: React.FC<EditPermissionProviderProps> = ({ isPrototyping, children }) => {
  const [canEditCanvas] = usePermissions(FEATURE_IDS.EDIT_CANVAS);

  const value = React.useMemo(() => {
    const canEdit = canEditCanvas && !isPrototyping;

    return {
      canEdit,
      isViewer: !canEditCanvas,
      isPrototyping,
    };
  }, [canEditCanvas, isPrototyping]);

  return <EditPermissionContext.Provider value={value}>{children}</EditPermissionContext.Provider>;
};

export const withEditPermission = withContext(EditPermissionContext, 'editPermission');
