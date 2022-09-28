// BEGIN FIXME: MVP - Custom blocks
import client from '@/client';

import { EventName } from '../constants';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackNewCustomBlockCreated = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.NEW_CUSTOM_BLOCK_CREATED, createProjectEventPayload(options))
);

export const trackCustomBlockPointerCreated = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CUSTOM_BLOCK_POINTER_CREATED, createProjectEventPayload(options))
);

export const trackCustomBlockPrototyped = createProjectEventTracker<{ prototypeID: string }>(({ prototypeID, ...options }) =>
  client.api.analytics.track(EventName.CUSTOM_BLOCK_PROTOTYPED, createProjectEventPayload(options, { prototypeID }))
);
// END FIXME: MVP - Custom blocks
