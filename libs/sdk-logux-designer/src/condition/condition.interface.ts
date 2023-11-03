import type { Markup, ObjectResource } from '@/common';

import type { PromptCreateData } from '../prompt/prompt.interface';
import type { ConditionType } from './condition-type.enum';

interface BaseCondition extends ObjectResource {
  assistantID: string;
  environmentID: string;
}

export interface PromptCondition extends BaseCondition {
  type: ConditionType.PROMPT;
  turns: number;
  promptID: string | null;
}

export interface ScriptCondition extends BaseCondition {
  type: ConditionType.SCRIPT;
  code: Markup;
}

export interface ExpressionCondition extends BaseCondition {
  type: ConditionType.EXPRESSION;
  matchAll: boolean;
}

export type PromptConditionCreateData =
  | Pick<PromptCondition, 'type' | 'turns'> & (Pick<PromptCondition, 'promptID'> | { prompt: PromptCreateData });

export interface ScriptConditionCreateData extends Pick<ScriptCondition, 'type' | 'code'> {}

export interface ExpressionConditionCreateData extends Pick<ExpressionCondition, 'type' | 'matchAll'> {}

export type AnyCondition = ExpressionCondition | PromptCondition | ScriptCondition;

export type AnyConditionCreateData =
  | PromptConditionCreateData
  | ScriptConditionCreateData
  | ExpressionConditionCreateData;
