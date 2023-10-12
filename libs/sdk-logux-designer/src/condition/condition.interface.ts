import type { Markup, ObjectResource } from '@/common';

import type { PromptCreateData } from '../prompt/prompt.interface';
import type { ConditionType } from './condition-type.enum';

interface BaseCondition extends ObjectResource {
  assistantID: string;
}

interface ExpressionOnlyConditionData {
  type: ConditionType.EXPRESSION;
  matchAll: boolean;
}

interface PromptOnlyConditionData {
  type: ConditionType.PROMPT;
  turns: number;
  promptID: string | null;
}

interface ScriptOnlyConditionData {
  type: ConditionType.SCRIPT;
  code: Markup;
}

export interface PromptCondition extends BaseCondition, PromptOnlyConditionData {}
export interface ScriptCondition extends BaseCondition, ScriptOnlyConditionData {}
export interface ExpressionCondition extends BaseCondition, ExpressionOnlyConditionData {}

export type PromptConditionCreateData =
  | Omit<PromptOnlyConditionData, 'promptID'> &
      (Pick<PromptOnlyConditionData, 'promptID'> | { prompt: PromptCreateData });
export interface ScriptConditionCreateData extends ScriptOnlyConditionData {}
export interface ExpressionConditionCreateData extends ExpressionOnlyConditionData {}

export type AnyCondition = ExpressionCondition | PromptCondition | ScriptCondition;
export type AnyConditionCreateData =
  | PromptConditionCreateData
  | ScriptConditionCreateData
  | ExpressionConditionCreateData;
