import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { PromptEntity } from '../prompt';
import type {
  BaseConditionEntity,
  ExpressionConditionEntity,
  PromptConditionEntity,
  ScriptConditionEntity,
} from './condition.entity';
import { ConditionType } from './condition-type.enum';

export const BaseConditionJSONAdapter = createSmartMultiAdapter<
  EntityObject<BaseConditionEntity>,
  ToJSONWithForeignKeys<BaseConditionEntity>,
  [],
  [],
  CMSKeyRemap
>(
  ({ assistant, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ assistantID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
  })
);

export const ExpressionConditionJSONAdapter = createSmartMultiAdapter<
  EntityObject<ExpressionConditionEntity>,
  ToJSONWithForeignKeys<ExpressionConditionEntity>,
  [],
  [],
  CMSKeyRemap
>(
  ({ type, ...data }) => ({
    ...BaseConditionJSONAdapter.fromDB(data),

    ...(type !== undefined && { type: ConditionType.EXPRESSION }),
  }),
  ({ type, ...data }) => ({
    ...BaseConditionJSONAdapter.toDB(data),

    ...(type !== undefined && { type: ConditionType.EXPRESSION }),
  })
);

export const PromptConditionJSONAdapter = createSmartMultiAdapter<
  EntityObject<PromptConditionEntity>,
  ToJSONWithForeignKeys<PromptConditionEntity>,
  [],
  [],
  CMSKeyRemap<[['prompt', 'promptID']]>
>(
  ({ type, ...data }) => ({
    ...BaseConditionJSONAdapter.fromDB(data),

    ...(type !== undefined && { type: ConditionType.PROMPT }),
  }),
  ({ type, promptID, ...data }) => ({
    ...BaseConditionJSONAdapter.toDB(data),

    ...(type !== undefined && { type: ConditionType.PROMPT }),

    ...(promptID !== undefined &&
      data.environmentID !== undefined && {
        prompt: promptID ? ref(PromptEntity, { id: promptID, environmentID: data.environmentID }) : null,
      }),
  })
);

export const ScriptConditionJSONAdapter = createSmartMultiAdapter<
  EntityObject<ScriptConditionEntity>,
  ToJSONWithForeignKeys<ScriptConditionEntity>,
  [],
  [],
  CMSKeyRemap
>(
  ({ type, ...data }) => ({
    ...BaseConditionJSONAdapter.fromDB(data),

    ...(type !== undefined && { type: ConditionType.SCRIPT }),
  }),
  ({ type, ...data }) => ({
    ...BaseConditionJSONAdapter.toDB(data),

    ...(type !== undefined && { type: ConditionType.SCRIPT }),
  })
);
