import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { PromptEntity } from '../prompt';
import type {
  BaseConditionEntity,
  ExpressionConditionEntity,
  PromptConditionEntity,
  ScriptConditionEntity,
} from './condition.entity';
import { ConditionType } from './condition-type.enum';

export const BaseConditionEntityAdapter = createSmartMultiAdapter<
  EntityObject<BaseConditionEntity>,
  ToJSONWithForeignKeys<BaseConditionEntity>,
  [],
  [],
  CMSKeyRemap
>(
  ({ assistant, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ assistantID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
  })
);

export const ExpressionConditionEntityAdapter = createSmartMultiAdapter<
  EntityObject<ExpressionConditionEntity>,
  ToJSONWithForeignKeys<ExpressionConditionEntity>,
  [],
  [],
  CMSKeyRemap
>(
  ({ type, ...data }) => ({
    ...BaseConditionEntityAdapter.fromDB(data),

    ...(type !== undefined && { type: ConditionType.EXPRESSION }),
  }),
  ({ type, ...data }) => ({
    ...BaseConditionEntityAdapter.toDB(data),

    ...(type !== undefined && { type: ConditionType.EXPRESSION }),
  })
);

export const PromptConditionEntityAdapter = createSmartMultiAdapter<
  EntityObject<PromptConditionEntity>,
  ToJSONWithForeignKeys<PromptConditionEntity>,
  [],
  [],
  CMSKeyRemap<[['prompt', 'promptID']]>
>(
  ({ type, ...data }) => ({
    ...BaseConditionEntityAdapter.fromDB(data),

    ...(type !== undefined && { type: ConditionType.PROMPT }),
  }),
  ({ type, promptID, ...data }) => ({
    ...BaseConditionEntityAdapter.toDB(data),

    ...(type !== undefined && { type: ConditionType.PROMPT }),

    ...(promptID !== undefined &&
      data.environmentID !== undefined && {
        prompt: promptID ? ref(PromptEntity, { id: promptID, environmentID: data.environmentID }) : null,
      }),
  })
);

export const ScriptConditionEntityAdapter = createSmartMultiAdapter<
  EntityObject<ScriptConditionEntity>,
  ToJSONWithForeignKeys<ScriptConditionEntity>,
  [],
  [],
  CMSKeyRemap
>(
  ({ type, ...data }) => ({
    ...BaseConditionEntityAdapter.fromDB(data),

    ...(type !== undefined && { type: ConditionType.SCRIPT }),
  }),
  ({ type, ...data }) => ({
    ...BaseConditionEntityAdapter.toDB(data),

    ...(type !== undefined && { type: ConditionType.SCRIPT }),
  })
);
