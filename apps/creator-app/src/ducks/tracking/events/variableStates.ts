import client from '@/client';

import type { VariableStateAppliedType } from '../constants';
import { EventName } from '../constants';
import { createProjectEvent, createProjectEventTracker } from '../utils';

export const trackVariableStateCreated = createProjectEventTracker<{ diagramID: string | null }>(
  ({ diagramID, ...eventInfo }) =>
    client.analytics.track(createProjectEvent(EventName.VARIABLE_STATE_CREATED, { ...eventInfo, diagramID }))
);

export const trackVariableStateDeleted = createProjectEventTracker(({ ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.VARIABLE_STATE_DELETED, eventInfo))
);

export const trackVariableStateEdited = createProjectEventTracker<{ editedFields: string[] }>(
  ({ editedFields, ...eventInfo }) =>
    client.analytics.track(
      createProjectEvent(EventName.VARIABLE_STATE_EDITED, { ...eventInfo, edited_fields: editedFields })
    )
);

export const trackVariableStateApplied = createProjectEventTracker<{ type: VariableStateAppliedType }>(
  ({ type, ...eventInfo }) =>
    client.analytics.track(createProjectEvent(EventName.VARIABLE_STATE_APPLIED, { ...eventInfo, test_type: type }))
);
