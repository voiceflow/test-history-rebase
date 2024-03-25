import { ConditionType } from '@voiceflow/dtos';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type {
  BaseConditionJSON,
  BaseConditionObject,
  ExpressionConditionJSON,
  ExpressionConditionObject,
  PromptConditionJSON,
  PromptConditionObject,
  ScriptConditionJSON,
  ScriptConditionObject,
} from './condition.interface';

export const BaseConditionEntityAdapter = createSmartMultiAdapter<BaseConditionObject, BaseConditionJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);

export const ExpressionConditionEntityAdapter = createSmartMultiAdapter<
  ExpressionConditionObject,
  ExpressionConditionJSON
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

export const PromptConditionEntityAdapter = createSmartMultiAdapter<PromptConditionObject, PromptConditionJSON>(
  ({ type, ...data }) => ({
    ...BaseConditionEntityAdapter.fromDB(data),

    ...(type !== undefined && { type: ConditionType.PROMPT }),
  }),
  ({ type, ...data }) => ({
    ...BaseConditionEntityAdapter.toDB(data),

    ...(type !== undefined && { type: ConditionType.PROMPT }),
  })
);

export const ScriptConditionEntityAdapter = createSmartMultiAdapter<ScriptConditionObject, ScriptConditionJSON>(
  ({ type, ...data }) => ({
    ...BaseConditionEntityAdapter.fromDB(data),

    ...(type !== undefined && { type: ConditionType.SCRIPT }),
  }),
  ({ type, ...data }) => ({
    ...BaseConditionEntityAdapter.toDB(data),

    ...(type !== undefined && { type: ConditionType.SCRIPT }),
  })
);
