import { Crypto } from '@voiceflow/common';
import { IS_DEVELOPMENT, Spinner } from '@voiceflow/ui';
import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

const getForceRefreshKey = (hash: string) => `component-has-force-refreshed:${hash}`;

const ComponentSpinner = () => <Spinner isMd />;

export const lazy = <T extends React.ComponentType<any>>(factory: () => Promise<{ default: T }>) =>
  React.lazy(async () => {
    const factoryHash = Crypto.MurmurHash.hash(factory.toString());
    const forceRefreshKey = getForceRefreshKey(factoryHash);

    try {
      const component = await factory();
      sessionStorage.removeItem(forceRefreshKey);
      return component;
    } catch (error) {
      if (IS_DEVELOPMENT || sessionStorage.getItem(forceRefreshKey)) {
        // The page has already been reloaded
        // Assuming that user is already using the latest version of the application.
        // Let's let the application crash and raise the error.
        throw error;
      }

      sessionStorage.setItem(forceRefreshKey, '1');
      window.location.reload();

      return { default: TabLoader as React.ComponentType<any> };
    }
  });

export const lazyComponent = <T extends React.ComponentType<any>, R>(
  factory: () => Promise<{ default: T }>,
  { fallback: Fallback = ComponentSpinner, forwardRef }: { fallback?: React.ComponentType; forwardRef?: boolean } = {}
) => {
  const LazyComponent = lazy(factory);

  return React.forwardRef<R, React.ComponentProps<T>>((props, ref) => (
    <React.Suspense fallback={<Fallback />}>
      <LazyComponent {...props} ref={forwardRef ? ref : undefined} />
    </React.Suspense>
  ));
};
