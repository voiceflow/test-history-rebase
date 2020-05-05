import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { IntercomAPI } from 'react-intercom';

import { INTERCOM_ENABLED, LOGROCKET_ENABLED, LOGROCKET_PROJECT } from '@/config';
import { Account } from '@/models';

export function initialize(callback: (sessionURL: string) => void) {
  if (LOGROCKET_ENABLED) {
    LogRocket.init(LOGROCKET_PROJECT);
    setupLogRocketReact(LogRocket);

    LogRocket.getSessionURL(callback);
  }
}

export function identify(user: Account) {
  if (LOGROCKET_ENABLED) {
    LogRocket.identify(String(user.creator_id), {
      email: user.email,
      name: user.name,
    });

    if (INTERCOM_ENABLED) {
      // add session URL to intercom timeline
      LogRocket.getSessionURL((sessionURL) => IntercomAPI('trackEvent', 'LogRocket', { sessionURL }));
    }
  }
}
