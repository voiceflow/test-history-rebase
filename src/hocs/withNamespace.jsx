/* eslint-disable react/display-name */
import React from 'react';

import { NamespaceProvider } from '@/contexts/NamespaceContext';

// eslint-disable-next-line import/prefer-default-export
export const withNamespace = (Component) =>
  React.forwardRef(({ namespace, ...props }, ref) => {
    const component = <Component {...props} ref={ref} />;

    return namespace ? <NamespaceProvider value={namespace}>{component}</NamespaceProvider> : component;
  });
