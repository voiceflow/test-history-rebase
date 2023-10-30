import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { IntentEntity } from '../intent.entity';
import type { UtteranceEntity } from './utterance.entity';

export const UtteranceJSONAdapter = createSmartMultiAdapter<
  EntityObject<UtteranceEntity>,
  ToJSONWithForeignKeys<UtteranceEntity>,
  [],
  [],
  CMSKeyRemap<[['intent', 'intentID']]>
>(
  ({ intent, assistant, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(intent !== undefined && { intentID: intent.id }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ intentID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(intentID !== undefined && {
        intent: ref(IntentEntity, { id: intentID, environmentID }),
      }),
    }),
  })
);
