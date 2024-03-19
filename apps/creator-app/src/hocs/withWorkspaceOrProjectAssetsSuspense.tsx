import React, { useContext, useEffect, useId } from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { PageLoaderContext } from '@/components/Loader/PageLoader/PageLoader.context';
import { PageLoaderLoaded } from '@/components/Loader/PageLoader/PageLoaderLoaded.component';
import WorkspaceOrProjectLoader from '@/gates/WorkspaceOrProjectLoader';

export const withWorkspaceOrProjectAssetsSuspense = (Component: React.FC) =>
  setDisplayName(wrapDisplayName(Component, 'withWorkspaceOrProjectAssetsSuspense'))(() => {
    const pageLoader = useContext(PageLoaderContext);
    const pageLoaderID = useId();

    useEffect(() => pageLoader.register(pageLoaderID), [pageLoaderID]);

    return (
      <React.Suspense fallback={<WorkspaceOrProjectLoader />}>
        <Component />

        <PageLoaderLoaded id={pageLoaderID} />
      </React.Suspense>
    );
  });
