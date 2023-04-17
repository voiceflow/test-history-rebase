import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Recent from '@/ducks/recent';

export * from './controls';
export { default as usePrototype } from './prototype';

export const usePublic = () => !!useRouteMatch(Path.PUBLIC_PROTOTYPE);

export const useDebug = () => {
  const isPublic = usePublic();
  const debug = useSelector(Recent.prototypeDebugSelector);

  return !isPublic && debug;
};
