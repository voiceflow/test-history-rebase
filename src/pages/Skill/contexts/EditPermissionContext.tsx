import React from 'react';

import { Permission } from '@/config/permissions';
import { withContext } from '@/hocs';
import { usePermission } from '@/hooks';
import { useCommentingMode } from '@/pages/Skill/hooks';

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
  const isCommentingMode = useCommentingMode();
  const value = React.useMemo(() => {
    const canEdit = canEditCanvas && !isPrototyping && !isCommentingMode;

    return {
      canEdit,
      isViewer: !canEditCanvas,
      isPrototyping,
    };
  }, [canEditCanvas, isPrototyping, isCommentingMode]);

  return <EditPermissionContext.Provider value={value}>{children}</EditPermissionContext.Provider>;
};

export const withEditPermission = withContext(EditPermissionContext, 'editPermission');
