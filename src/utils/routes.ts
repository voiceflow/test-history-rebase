import { match, matchPath } from 'react-router-dom';

export const RootRoutes = {
  PROJECT: 'project',
};

// eslint-disable-next-line import/prefer-default-export
export const getActivePageAndMatch = <P extends object = {}>(
  routesMatches: Record<string, string[]>,
  fullPathName: string,
  basePath = ''
): {
  activePageMatch: match<P> | null;
  activePage: string | null;
} => {
  let activePageMatch = null;

  const activePage =
    Object.keys(routesMatches).find((key) =>
      routesMatches[key].find((path) => {
        activePageMatch = matchPath(fullPathName, { path: `${basePath}${path}` });

        return !!activePageMatch;
      })
    ) || null;

  return { activePage, activePageMatch };
};
