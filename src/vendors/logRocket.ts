import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

import { LOGROCKET_ENABLED, LOGROCKET_PROJECT } from '@/config';
import { Account } from '@/models';

export function initialize(callback: (sessionURL: string) => void) {
  if (!LOGROCKET_ENABLED) return;

  LogRocket.init(LOGROCKET_PROJECT);
  setupLogRocketReact(LogRocket);

  LogRocket.getSessionURL(callback);
}

export function identify(id: string, user: Omit<Account, 'creator_id'>) {
  if (!LOGROCKET_ENABLED) return;

  LogRocket.identify(id, {
    email: user.email,
    name: user.name,
  });
}

export const getSessionURL = (callback: (sessionURL: string) => void) => LogRocket.getSessionURL(callback);
