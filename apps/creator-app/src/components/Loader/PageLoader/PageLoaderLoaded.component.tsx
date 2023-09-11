import { useContext, useEffect } from 'react';

import { PageLoaderContext } from './PageLoader.context';
import type { IPageLoaderLoaded } from './PageLoader.interface';

export const PageLoaderLoaded: React.FC<IPageLoaderLoaded> = ({ id }) => {
  const pageLoader = useContext(PageLoaderContext);

  useEffect(() => pageLoader.loaded(id), []);

  return null;
};
