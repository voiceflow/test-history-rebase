/* eslint-disable react/display-name */
import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

// eslint-disable-next-line import/prefer-default-export
export const withLoadingGate = (LoadingGate) => (Component) =>
  setDisplayName(wrapDisplayName(Component, 'withLoadingGate'))(
    React.forwardRef((props, ref) => <LoadingGate>{() => <Component {...props} ref={ref} />}</LoadingGate>)
  );
