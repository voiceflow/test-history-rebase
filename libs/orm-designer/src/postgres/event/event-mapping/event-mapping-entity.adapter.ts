import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import { VariableEntity } from '@/postgres/variable';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { EventEntity } from '../event.entity';
import type { EventMappingEntity } from './event-mapping.entity';

export const EventMappingEntityAdapter = createSmartMultiAdapter<
  EntityObject<EventMappingEntity>,
  ToJSONWithForeignKeys<EventMappingEntity>,
  [],
  [],
  CMSKeyRemap<[['event', 'eventID'], ['variable', 'variableID']]>
>(
  ({ event, assistant, variable, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(event !== undefined && { eventID: event.id }),

    ...(variable !== undefined && { variableID: variable?.id ?? null }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ eventID, variableID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(eventID !== undefined && {
        event: ref(EventEntity, { id: eventID, environmentID }),
      }),

      ...(variableID !== undefined && {
        variable: variableID ? ref(VariableEntity, { id: variableID, environmentID }) : null,
      }),
    }),
  })
);
