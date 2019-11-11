import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import BatchLoadingGate from '@/componentsV2/BatchLoadingGate';

// eslint-disable-next-line import/prefer-default-export
export const withBatchLoadingGate = (...gates) => (Component) =>
  setDisplayName(wrapDisplayName(Component, 'withBatchLoadingGate'))((props) => (
    <BatchLoadingGate {...props} gates={gates}>
      {(gateProps) => <Component {...gateProps} />}
    </BatchLoadingGate>
  ));
