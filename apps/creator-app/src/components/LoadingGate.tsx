import React, { useContext, useEffect, useId } from 'react';

import { DEBUG_LOADING_GATES } from '@/config';
import logger from '@/utils/logger';

import { PageLoaderContext } from './Loader/PageLoader/PageLoader.context';
import { PageLoaderLoaded } from './Loader/PageLoader/PageLoaderLoaded.component';

const log = logger.child('LoadingGate');

export interface LoadingGateProps extends React.PropsWithChildren {
  load?: null | (() => void);
  unload?: () => void;
  isLoaded: boolean;
  loader?: React.ReactElement;
  internalName: string;
}

export const LoadingGate: React.FC<LoadingGateProps> = ({ load, unload, children = null, isLoaded, loader = null, internalName }) => {
  const pageLoader = useContext(PageLoaderContext);
  const pageLoaderID = useId();

  useEffect(() => pageLoader.register(pageLoaderID), [pageLoaderID]);

  useEffect(() => {
    if (isLoaded) return unload;

    if (DEBUG_LOADING_GATES) {
      log.info('loading', log.bold(internalName));
    }

    load?.();

    return undefined;
  }, [isLoaded]);

  return isLoaded ? (
    <>
      {children}
      <PageLoaderLoaded id={pageLoaderID} />
    </>
  ) : (
    loader
  );
};
