import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { identity } from '@/utils/functional';

// eslint-disable-next-line import/prefer-default-export
export const withHook = (useHook, { getProps = identity, shouldRender } = {}, ...args) => (Component) =>
  setDisplayName(wrapDisplayName(Component, 'withHook'))(
    // eslint-disable-next-line react/display-name
    React.forwardRef((props, ref) => {
      const value = useHook(...args, props);
      const allProps = { ...getProps(value), ...props, ref };

      if (shouldRender && !shouldRender(allProps)) {
        return null;
      }

      return <Component {...allProps} />;
    })
  );
