import React from 'react';

import { Permission } from '@/config/permissions';
import { withContext } from '@/hocs';
import { usePermission } from '@/hooks';
import { CommentModeContext } from '@/pages/Skill/contexts/CommentingContext';

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
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const commenting = React.useContext(CommentModeContext);
  const value = React.useMemo(() => {
    const canEdit = canEditCanvas && !isPrototyping && !commenting.isOpen;

    return {
      canEdit,
      isViewer: !canEditCanvas,
      isPrototyping,
    };
  }, [canEditCanvas, isPrototyping, commenting.isOpen]);

  return <EditPermissionContext.Provider value={value}>{children}</EditPermissionContext.Provider>;
};

export const withEditPermission = withContext(EditPermissionContext, 'editPermission');
