import { useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';

export const useCommentingMode = () => !!useRouteMatch(Path.CANVAS_COMMENTING);
