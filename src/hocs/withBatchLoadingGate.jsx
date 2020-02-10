import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import BatchLoadingGate from '@/components/BatchLoadingGate';

// eslint-disable-next-line import/prefer-default-export
export const withBatchLoadingGate = (...gates) => (Component) =>
  setDisplayName(wrapDisplayName(Component, 'withBatchLoadingGate'))((props) => (
    <BatchLoadingGate {...props} gates={gates}>
      {(gateProps) => <Component {...gateProps} />}
    </BatchLoadingGate>
  ));
