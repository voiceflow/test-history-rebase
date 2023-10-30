import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { PromptConditionEntity } from '../condition.entity';
import type { ConditionPredicateEntity } from './condition-predicate.entity';

export const ConditionPredicateJSONAdapter = createSmartMultiAdapter<
  EntityObject<ConditionPredicateEntity>,
  ToJSONWithForeignKeys<ConditionPredicateEntity>,
  [],
  [],
  CMSKeyRemap<[['condition', 'conditionID']]>
>(
  ({ assistant, condition, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(assistant !== undefined && { assistantID: assistant.id }),

    ...(condition !== undefined && { conditionID: condition.id }),
  }),
  ({ assistantID, conditionID, environmentID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(conditionID !== undefined && {
        condition: ref(PromptConditionEntity, { id: conditionID, environmentID }),
      }),
    }),
  })
);
