import client from '@/client';

import { EventName } from '../constants';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackVariableStateCreated = createProjectEventTracker<{ diagramID: string | null }>(({ diagramID, ...options }) =>
  client.api.analytics.track(EventName.VARIABLE_STATE_CREATED, createProjectEventPayload(options, { diagramID }))
);
