import { matchPath } from 'react-router-dom';

export const RootRoutes = {
  PROJECT: 'project',
};

// eslint-disable-next-line import/prefer-default-export
export function getActivePageAndMatch(routesMatches, fullPathName, basePath = '') {
  let activePageMatch;

  const activePage = Object.keys(routesMatches).find((key) =>
    routesMatches[key].find((path) => {
      activePageMatch = matchPath(fullPathName, { path: `${basePath}${path}` });

      return !!activePageMatch;
    })
  );

  return { activePage, activePageMatch };
}
