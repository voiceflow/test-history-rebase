import type { EntityDTO } from '@mikro-orm/core';

import type { ExpressionConditionEntity, PromptConditionEntity, ScriptConditionEntity } from './condition.entity';
import { conditionAssertionList } from './condition-assertion/condition-assertion.fixture';
import { conditionPredicateList } from './condition-predicate/condition-predicate.fixture';
import { ConditionType } from './condition-type.enum';

const baseCondition = {
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  assistant: { id: 'assistant-1' } as any,
};

export const expressionCondition: EntityDTO<ExpressionConditionEntity> = {
  ...baseCondition,
  id: 'condition-1',
  type: ConditionType.EXPRESSION,
  matchAll: true,
  assertions: conditionAssertionList,
  environmentID: 'environment-1',
};

export const promptCondition: EntityDTO<PromptConditionEntity> = {
  ...baseCondition,
  id: 'condition-2',
  type: ConditionType.PROMPT,
  turns: 3,
  prompt: { id: 'prompt-1' } as any,
  predicates: conditionPredicateList,
  environmentID: 'environment-1',
};

export const scriptCondition: EntityDTO<ScriptConditionEntity> = {
  ...baseCondition,
  id: 'condition-3',
  type: ConditionType.SCRIPT,
  code: ['var x = 123;'],
  environmentID: 'environment-1',
};

export const conditionList = [expressionCondition, promptCondition, scriptCondition];
