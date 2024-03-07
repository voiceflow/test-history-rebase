import type { EntityDTO } from '@mikro-orm/core';
import { FunctionVariableKind } from '@voiceflow/dtos';

import type { FunctionVariableEntity } from './function-variable.entity';

export const functionVariable: EntityDTO<FunctionVariableEntity> = {
  id: 'function-variable-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  name: 'first_function_variable',
  description: 'function variable description',
  type: FunctionVariableKind.INPUT,
  function: { id: 'function-1' } as any,
  assistant: { id: 'assistant-1' } as any,
  environmentID: 'environment-1',
};

export const functionVariableList: EntityDTO<FunctionVariableEntity>[] = [
  functionVariable,
  {
    ...functionVariable,
    id: 'function-variable-2',
    name: 'second_function_variable',
    description: null,
    type: FunctionVariableKind.OUTPUT,
  },
];
