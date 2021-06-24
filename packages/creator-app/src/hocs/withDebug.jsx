import { logger } from '@voiceflow/ui';
import React from 'react';
import { getDisplayName, setDisplayName, wrapDisplayName } from 'recompose';

import { IS_PRODUCTION } from '@/config';

// eslint-disable-next-line import/prefer-default-export
export const withDebug = (Component) => {
  if (IS_PRODUCTION) {
    return Component;
  }

  const componentName = getDisplayName(Component);
  const log = logger.child(`debug(${getDisplayName(Component)})`);

  return setDisplayName(wrapDisplayName(Component, 'withDebug'))((props) => {
    const [hasRendered, updateRendered] = React.useState(false);

    log.debug(hasRendered ? 're-rendering' : 'rendering', `<${componentName} />`, props);

    React.useEffect(() => {
      if (!hasRendered) {
        updateRendered(true);
      }
    }, [hasRendered, updateRendered]);

    return <Component {...props} />;
  });
};
