import { Spinner } from '@voiceflow/ui';
import React from 'react';

const ComponentSpinner = () => <Spinner isMd />;

// eslint-disable-next-line import/prefer-default-export
export const lazy = <T extends React.ComponentType<any>>(factory: () => Promise<{ default: T }>) => React.lazy(() => factory());

export const lazyComponent = <T extends React.ComponentType<any>, R>(
  factory: () => Promise<{ default: T }>,
  { fallback: Fallback = ComponentSpinner, forwardRef }: { fallback?: React.ComponentType; forwardRef?: boolean } = {}
) => {
  const LazyComponent = React.lazy(() => factory());

  return React.forwardRef<R, React.ComponentProps<T>>((props, ref) => (
    <React.Suspense fallback={<Fallback />}>
      <LazyComponent {...props} ref={forwardRef ? ref : undefined} />
    </React.Suspense>
  ));
};
