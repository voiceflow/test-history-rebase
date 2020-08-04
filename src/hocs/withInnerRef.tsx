import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

export type WithInnerRefProps<T, P extends Record<string, unknown>> = P & {
  innerRef: ((instance: T | null) => void) | React.MutableRefObject<T | null> | null;
};

export const withInnerRef = <T, P extends Record<string, unknown>>(Component: React.FC<WithInnerRefProps<T, P>>) =>
  setDisplayName(wrapDisplayName(Component, 'withInnerRef'))(
    // eslint-disable-next-line react/display-name
    React.forwardRef<T, P>((props, ref) => {
      return <Component {...props} innerRef={ref} />;
    })
  );
