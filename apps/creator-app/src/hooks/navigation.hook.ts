import { useCallback } from 'react';
import { ExtractRouteParams } from 'react-router';
import { generatePath, useHistory, useLocation, useRouteMatch } from 'react-router-dom';

/**
 * similar to `useResolvedPath` but getter
 */
export const useGetResolvedPath = () => {
  const match = useRouteMatch();
  const { pathname: locationPathname } = useLocation();

  return useCallback(
    <S extends string>(to: S, params?: ExtractRouteParams<S>): string => generatePath(to, { ...match?.params, ...params } as any),
    [match, locationPathname]
  );
};

interface LinkClickOptions<S extends string> {
  state?: any;
  params?: ExtractRouteParams<S>;
  target?: string;
  search?: string;
  replace?: boolean;
}

interface OnLinkClick {
  <S extends string>(to: S, options?: LinkClickOptions<S>): <Elm extends Element>(event: React.MouseEvent<Elm, MouseEvent>) => void;
}

/**
 * handles link click, similar to `useNavigate` but opens link in new tab if `target="_blank"` or `event.metaKey` is true
 */
export const useOnLinkClick = (): OnLinkClick => {
  const history = useHistory();
  const location = useLocation();
  const getResolvedPath = useGetResolvedPath();

  return useCallback(
    (to, { state, target, params, search, replace: replaceProp } = {}) =>
      (event) => {
        event.preventDefault();

        const pathname = getResolvedPath(to, params);

        if (target === '_blank' || event.metaKey) {
          const newWindow = window.open(`${pathname}${search ?? ''}`, '_blank');

          if (!event.metaKey) {
            newWindow?.focus();
          }

          return;
        }

        // If the URL hasn't changed, a regular <a> will do a replace instead of
        // a push, so do the same here unless the replace prop is explicitly set
        if (replaceProp !== undefined ? replaceProp : location.pathname === pathname) {
          history.replace({ state, search, pathname });
        } else {
          history.push({ state, search, pathname });
        }
      },
    [location, history]
  );
};
