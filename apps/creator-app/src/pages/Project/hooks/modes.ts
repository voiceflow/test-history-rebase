import { useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';

export const useCommentingMode = () => !!useRouteMatch([Path.CANVAS_COMMENTING, Path.CANVAS_COMMENTING_THREAD]);

export const useTextMarkupMode = () => !!useRouteMatch([Path.CANVAS_TEXT_MARKUP]);

export const usePrototypingMode = () => !!useRouteMatch([Path.PROJECT_PROTOTYPE]);

export const useCanvasMode = () => !!useRouteMatch([Path.PROJECT_CANVAS]);

export const useDashboardMode = () => !!useRouteMatch(Path.WORKSPACE_DASHBOARD);

export const useInteractiveMode = () => {
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();

  return isCommentingMode || isPrototypingMode;
};

export const useAnyModeOpen = () => {
  const isInteractiveMode = useInteractiveMode();
  const isTextMarkupMode = useTextMarkupMode();

  return isInteractiveMode || isTextMarkupMode;
};

export const useEditingMode = () => {
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const isInteractiveMode = useInteractiveMode();

  return canEditCanvas && !isInteractiveMode;
};
