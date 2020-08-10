/* eslint-disable import/prefer-default-export */
import { useRouteMatch } from 'react-router-dom';

import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import { usePermission } from '@/hooks';

export const useCommentingMode = () => !!useRouteMatch(Path.CANVAS_COMMENTING);

export const usePrototypingMode = () => !!useRouteMatch([Path.PROJECT_DEMO, Path.PROJECT_PROTOTYPE]);

export const useMarkupMode = () => !!useRouteMatch(Path.CANVAS_MARKUP);

export const useEditingMode = () => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const isCommentingMode = useCommentingMode();
  const isPrototypingMode = usePrototypingMode();

  return canEditCanvas && !isCommentingMode && !isPrototypingMode;
};
