import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { ExpressionConditionEntity } from '../condition.entity';
import type { ConditionAssertionEntity } from './condition-assertion.entity';

export const ConditionAssertionJSONAdapter = createSmartMultiAdapter<
  EntityObject<ConditionAssertionEntity>,
  ToJSONWithForeignKeys<ConditionAssertionEntity>,
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
        condition: ref(ExpressionConditionEntity, { id: conditionID, environmentID }),
      }),
    }),
  })
);
