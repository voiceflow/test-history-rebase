import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { NamespaceProvider } from '@/contexts/NamespaceContext';

export interface ExtraNamespaceProps {
  namespace?: string | string[];
}

export const withNamespace = <T, P extends Record<string, any>>(Component: React.ComponentType<P>) =>
  setDisplayName(wrapDisplayName(Component, 'withNamespace'))(
    React.forwardRef<T, P & ExtraNamespaceProps>(({ namespace, ...props }, ref) => {
      const component = <Component {...(props as P)} ref={ref} />;

      return namespace ? <NamespaceProvider value={namespace}>{component}</NamespaceProvider> : component;
    })
  );
