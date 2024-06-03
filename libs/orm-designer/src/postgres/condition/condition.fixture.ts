import type { EntityDTO } from '@mikro-orm/core';
import { ConditionOperation, ConditionType } from '@voiceflow/dtos';

import type { ExpressionConditionEntity, PromptConditionEntity, ScriptConditionEntity } from './condition.entity';

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
  assertions: [
    {
      lhs: ['test'],
      rhs: ['test'],
      operation: ConditionOperation.IS
    }
  ],
  environmentID: 'environment-1',
};

export const promptCondition: EntityDTO<PromptConditionEntity> = {
  ...baseCondition,
  id: 'condition-2',
  type: ConditionType.PROMPT,
  turns: 3,
  prompt: { id: 'prompt-1' } as any,
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
