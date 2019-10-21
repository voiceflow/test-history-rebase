import React from 'react';
import { getDisplayName, setDisplayName, wrapDisplayName } from 'recompose';

import { IS_PRODUCTION } from '@/config';

// eslint-disable-next-line import/prefer-default-export
export const withDebug = (Component) => {
  if (IS_PRODUCTION) {
    return Component;
  }

  return setDisplayName(wrapDisplayName(Component, 'withDebug'))((props) => {
    const [hasRendered, updateRendered] = React.useState(false);

    // eslint-disable-next-line no-console
    console.log(hasRendered ? 're-rendering' : 'rendering', `<${getDisplayName(Component)} />`, props);

    React.useEffect(() => {
      if (!hasRendered) {
        updateRendered(true);
      }
    }, [hasRendered, updateRendered]);

    return <Component {...props} />;
  });
};
