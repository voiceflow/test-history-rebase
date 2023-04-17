import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import BatchLoadingGate, { Gate } from '@/components/BatchLoadingGate';

export const withBatchLoadingGate =
  (...gates: Gate[]) =>
  <P extends object>(Component: React.ComponentType<P>): React.ComponentType<P> =>
    React.memo<P>(
      setDisplayName(wrapDisplayName(Component, 'withBatchLoadingGate'))((props: P) => (
        <BatchLoadingGate gates={gates}>
          <Component {...props} />
        </BatchLoadingGate>
      ))
    );
