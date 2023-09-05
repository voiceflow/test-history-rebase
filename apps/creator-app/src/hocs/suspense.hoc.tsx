import React, { useContext, useEffect, useId } from 'react';

import { PageLoaderContext } from '@/components/Loader/PageLoader/PageLoader.context';
import { PageLoaderLoaded } from '@/components/Loader/PageLoader/PageLoaderLoaded.component';
import { hocComponentFactory } from '@/utils/hoc.util';

interface LoaderProps {
  name?: string;
  backgroundColor?: string;
}

interface Options extends LoaderProps {
  loader: React.ReactNode;
}

export const withSuspense =
  ({ loader }: Options) =>
  (Component: React.FC) =>
    hocComponentFactory(
      Component,
      'withSuspense'
    )(() => {
      const pageLoader = useContext(PageLoaderContext);
      const pageLoaderID = useId();

      useEffect(() => pageLoader.register(pageLoaderID), [pageLoaderID]);

      return (
        <React.Suspense fallback={loader}>
          <Component />

          <PageLoaderLoaded id={pageLoaderID} />
        </React.Suspense>
      );
    });
