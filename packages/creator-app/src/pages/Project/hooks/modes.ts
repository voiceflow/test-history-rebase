import { useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';

export const useCommentingMode = () => !!useRouteMatch([Path.CANVAS_COMMENTING, Path.CANVAS_COMMENTING_THREAD]);

export const useTextMarkupMode = () => !!useRouteMatch([Path.CANVAS_TEXT_MARKUP]);

export const usePrototypingMode = () => !!useRouteMatch([Path.PROJECT_DEMO, Path.PROJECT_PROTOTYPE]);

export const useCanvasMode = () => !!useRouteMatch(Path.DOMAIN_CANVAS);

export const useDashboardMode = () => !!useRouteMatch(Path.WORKSPACE_DASHBOARD);

export const useAnyModeOpen = () => {
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();
  const isTextMarkupMode = useTextMarkupMode();

  return isCommentingMode || isPrototypingMode || isTextMarkupMode;
};

export const useEditingMode = () => {
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();

  return canEditCanvas && !isCommentingMode && !isPrototypingMode;
};
