import client from '@/client';

import { EventName } from '../constants';
import { createProjectEvent, createVersionEventTracker } from '../utils';

export const trackComponentCreated = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.COMPONENT_CREATED, eventInfo))
);

export const trackComponentDeleted = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.COMPONENT_DELETED, eventInfo))
);
