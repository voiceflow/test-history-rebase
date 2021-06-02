import client from '@/client';

import { EventName } from '../constants';

export const trackSessionBegin =
  (workspaceIDs: string[] = []) =>
  () => {
    client.analytics.track(EventName.SESSION_BEGIN);
    client.analytics.identify({
      traits: { workspace_id: workspaceIDs },
      teamhashed: ['workspace_id'],
    });
  };

export const trackSessionDuration = (duration: number) => () =>
  client.analytics.track(EventName.SESSION_DURATION, { properties: { duration: Math.floor(duration / 1000) } });
