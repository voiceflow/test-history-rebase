import client from '@/client';

import { EventName } from '../constants';

export const trackSessionBegin = (workspaceIDs: string[] = []) => () => {
  client.analytics.track(EventName.SESSION_BEGIN);
  client.analytics.identify({ workspace_ids: workspaceIDs });
};

export const trackSessionDuration = (duration: number) => () =>
  client.analytics.track(EventName.SESSION_DURATION, { properties: { duration: Math.floor(duration / 1000) } });
