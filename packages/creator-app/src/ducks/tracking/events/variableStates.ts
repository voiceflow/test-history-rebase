import client from '@/client';

import { EventName, VariableStateAppliedType } from '../constants';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackVariableStateCreated = createProjectEventTracker<{ diagramID: string | null }>(({ diagramID, ...options }) =>
  client.api.analytics.track(EventName.VARIABLE_STATE_CREATED, createProjectEventPayload(options, { diagramID }))
);

export const trackVariableStateDeleted = createProjectEventTracker(({ ...options }) =>
  client.api.analytics.track(EventName.VARIABLE_STATE_DELETED, createProjectEventPayload(options))
);

export const trackVariableStateEdited = createProjectEventTracker<{ editedFields: string[] }>(({ editedFields, ...options }) =>
  client.api.analytics.track(EventName.VARIABLE_STATE_EDITED, createProjectEventPayload(options, { edited_fields: editedFields }))
);

export const trackVariableStateApplied = createProjectEventTracker<{ type: VariableStateAppliedType }>(({ type, ...options }) =>
  client.api.analytics.track(EventName.VARIABLE_STATE_APPLIED, createProjectEventPayload(options, { test_type: type }))
);
