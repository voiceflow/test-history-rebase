import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { IntercomAPI } from 'react-intercom';

import { LOGROCKET_ENABLED, LOGROCKET_PROJECT } from '@/config';

export function initializeLogRocket(cb) {
  if (LOGROCKET_ENABLED) {
    LogRocket.init(LOGROCKET_PROJECT);
    setupLogRocketReact(LogRocket);

    LogRocket.getSessionURL(cb);
  }
}

export function identifyLogRocketUser(user) {
  if (LOGROCKET_ENABLED) {
    LogRocket.identify(user.creator_id, {
      email: user.email,
      name: user.name,
    });

    // add session URL to intercom timeline
    LogRocket.getSessionURL((sessionURL) => IntercomAPI('trackEvent', 'LogRocket', { sessionURL }));
  }
}
