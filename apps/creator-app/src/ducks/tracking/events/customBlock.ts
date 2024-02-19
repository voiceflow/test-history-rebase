import client from '@/client';

import { EventName } from '../constants';
import { createProjectEvent, createProjectEventTracker } from '../utils';

export const trackNewCustomBlockCreated = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.NEW_CUSTOM_BLOCK_CREATED, eventInfo))
);

export const trackCustomBlockPointerCreated = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CUSTOM_BLOCK_POINTER_CREATED, eventInfo))
);

export const trackCustomBlockPrototyped = createProjectEventTracker<{ prototypeID: string }>(({ prototypeID, ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.CUSTOM_BLOCK_PROTOTYPED, { ...eventInfo, prototype_id: prototypeID }))
);
