import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import { EntityEntity } from '@/postgres/entity';
import { ResponseEntity } from '@/postgres/response';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { IntentEntity } from '../intent.entity';
import type { RequiredEntityEntity } from './required-entity.entity';

export const RequiredEntityEntityAdapter = createSmartMultiAdapter<
  EntityObject<RequiredEntityEntity>,
  ToJSONWithForeignKeys<RequiredEntityEntity>,
  [],
  [],
  CMSKeyRemap<[['intent', 'intentID'], ['entity', 'entityID'], ['reprompt', 'repromptID']]>
>(
  ({ entity, intent, reprompt, assistant, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(entity !== undefined && { entityID: entity.id }),

    ...(intent !== undefined && { intentID: intent.id }),

    ...(reprompt !== undefined && { repromptID: reprompt?.id ?? null }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ entityID, intentID, repromptID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(intentID !== undefined && {
        intent: ref(IntentEntity, { id: intentID, environmentID }),
      }),

      ...(entityID !== undefined && {
        entity: ref(EntityEntity, { id: entityID, environmentID }),
      }),

      ...(repromptID !== undefined && {
        reprompt: repromptID ? ref(ResponseEntity, { id: repromptID, environmentID }) : null,
      }),
    }),
  })
);
