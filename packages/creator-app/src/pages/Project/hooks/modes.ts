import queryString from 'query-string';
import { useLocation, useRouteMatch } from 'react-router-dom';

import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import { usePermission } from '@/hooks';
import { QUERY_PARAMS } from '@/pages/Project/constants';

export const useCommentingMode = () => !!useRouteMatch([Path.CANVAS_COMMENTING, Path.CANVAS_COMMENTING_THREAD]);

export const useTextMarkupMode = () => !!useRouteMatch([Path.CANVAS_TEXT_MARKUP]);

export const usePrototypingMode = () => !!useRouteMatch([Path.PROJECT_DEMO, Path.PROJECT_PROTOTYPE]);

export const useCanvasMode = () => !!useRouteMatch(Path.PROJECT_CANVAS);

export const useDashboardMode = () => !!useRouteMatch(Path.WORKSPACE_DASHBOARD);

export const useProjectPreviewMode = () => {
  const location = useLocation();
  const search = queryString.parse(location.search);
  return !!search[QUERY_PARAMS.PREVIEWING];
};

export const useAnyModeOpen = () => {
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();
  const isTextMarkupMode = useTextMarkupMode();

  return isCommentingMode || isPrototypingMode || isTextMarkupMode;
};

export const useEditingMode = () => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();

  return canEditCanvas && !isCommentingMode && !isPrototypingMode;
};
