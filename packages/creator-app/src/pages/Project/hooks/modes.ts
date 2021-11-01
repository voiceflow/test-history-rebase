import { useRouteMatch } from 'react-router-dom';

import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import { usePermission } from '@/hooks';

export const useCommentingMode = () => !!useRouteMatch(Path.CANVAS_COMMENTING);

export const usePrototypingMode = () => !!useRouteMatch([Path.PROJECT_DEMO, Path.PROJECT_PROTOTYPE]);

export const useCanvasMode = () => !!useRouteMatch(Path.PROJECT_CANVAS);

export const useDashboardMode = () => !!useRouteMatch(Path.WORKSPACE_DASHBOARD);

export const useAnyModeOpen = () => {
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();

  return isCommentingMode || isPrototypingMode;
};

export const useEditingMode = () => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();

  return canEditCanvas && !isCommentingMode && !isPrototypingMode;
};
