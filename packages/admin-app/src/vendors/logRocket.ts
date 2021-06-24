import { IS_PRODUCTION } from '@voiceflow/ui';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

export const LOGROCKET_ENABLED = IS_PRODUCTION || process.env.LOGROCKET_ENABLED === 'true';

export function initialize(project: string, callback: (sessionURL: string) => void) {
  if (!LOGROCKET_ENABLED) return;

  LogRocket.init(project);
  setupLogRocketReact(LogRocket);

  LogRocket.getSessionURL(callback);
}

export function identify(id: string, user: { email: string; name: string }) {
  if (!LOGROCKET_ENABLED) return;

  LogRocket.identify(id, {
    email: user.email,
    name: user.name,
  });
}

export const getSessionURL = (callback: (sessionURL: string) => void) => LogRocket.getSessionURL(callback);
