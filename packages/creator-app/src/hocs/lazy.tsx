import { FullSpinner, Spinner } from '@voiceflow/ui';
import React from 'react';

const ALREADY_FORCE_REFRESH_KEY = 'page-has-been-force-refreshed';

const LazyLoadSpinner = () => {
  React.useEffect(() => {
    sessionStorage.setItem(ALREADY_FORCE_REFRESH_KEY, 'true');
    window.location.reload();
  }, []);
  return <FullSpinner />;
};

const ComponentSpinner = () => <Spinner isMd />;

export const lazy = <T extends React.ComponentType<any>>(factory: () => Promise<{ default: T }>) =>
  React.lazy(async () => {
    try {
      const component = await factory();
      sessionStorage.removeItem(ALREADY_FORCE_REFRESH_KEY);
      return component;
    } catch (error) {
      if (sessionStorage.getItem(ALREADY_FORCE_REFRESH_KEY)) {
        // The page has already been reloaded
        // Assuming that user is already using the latest version of the application.
        // Let's let the application crash and raise the error.
        throw error;
      }
      return { default: LazyLoadSpinner as React.ComponentType<any> };
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
