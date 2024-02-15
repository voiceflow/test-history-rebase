import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { PromptConditionEntity } from '../condition.entity';
import type { ConditionPredicateEntity } from './condition-predicate.entity';

export const ConditionPredicateEntityAdapter = createSmartMultiAdapter<
  EntityObject<ConditionPredicateEntity>,
  ToJSONWithForeignKeys<ConditionPredicateEntity>,
  [],
  [],
  CMSKeyRemap<[['condition', 'conditionID']]>
>(
  ({ assistant, condition, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(assistant !== undefined && { assistantID: assistant.id }),

    ...(condition !== undefined && { conditionID: condition.id }),
  }),
  ({ assistantID, conditionID, environmentID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(conditionID !== undefined && {
        condition: ref(PromptConditionEntity, { id: conditionID, environmentID }),
      }),
    }),
  })
);
