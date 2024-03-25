import type { ToJSON, ToObject } from '@/types';

import type {
  BaseConditionEntity,
  ExpressionConditionEntity,
  PromptConditionEntity,
  ScriptConditionEntity,
} from './condition.entity';

export type BaseConditionObject = ToObject<BaseConditionEntity>;
export type BaseConditionJSON = ToJSON<BaseConditionObject>;

export type ExpressionConditionObject = ToObject<ExpressionConditionEntity>;
export type ExpressionConditionJSON = ToJSON<ExpressionConditionObject>;

export type PromptConditionObject = ToObject<PromptConditionEntity>;
export type PromptConditionJSON = ToJSON<PromptConditionObject>;

export type ScriptConditionObject = ToObject<ScriptConditionEntity>;
export type ScriptConditionJSON = ToJSON<ScriptConditionObject>;

export type AnyConditionJSON = ExpressionConditionJSON | PromptConditionJSON | ScriptConditionJSON;
export type AnyConditionObject = ExpressionConditionObject | PromptConditionObject | ScriptConditionObject;
export type AnyConditionEntity = ExpressionConditionEntity | PromptConditionEntity | ScriptConditionEntity;
