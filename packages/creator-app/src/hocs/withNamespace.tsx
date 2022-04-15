import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { NamespaceProvider } from '@/contexts/NamespaceContext';

export const withNamespace = <T, P extends Record<string, unknown>>(Component: React.ComponentType<P>) =>
  setDisplayName(wrapDisplayName(Component, 'withNamespace'))(
    // eslint-disable-next-line react/display-name
    React.forwardRef<T, P & { namespace?: string | string[] }>(({ namespace, ...props }, ref) => {
      const component = <Component {...(props as P)} ref={ref} />;

      return namespace ? <NamespaceProvider value={namespace}>{component}</NamespaceProvider> : component;
    })
  );
