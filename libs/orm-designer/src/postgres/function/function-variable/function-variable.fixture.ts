import type { EntityDTO } from '@mikro-orm/core';

import type { FunctionVariableEntity } from './function-variable.entity';
import { FunctionVariableType } from './function-variable-type.enum';

export const functionVariable: EntityDTO<FunctionVariableEntity> = {
  id: 'function-variable-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedByID: 1,
  name: 'first_function_variable',
  description: 'function variable description',
  type: FunctionVariableType.INPUT,
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
    type: FunctionVariableType.OUTPUT,
  },
];
