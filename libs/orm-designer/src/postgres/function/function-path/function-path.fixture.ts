import type { EntityDTO } from '@mikro-orm/core';

import type { FunctionPathEntity } from './function-path.entity';

export const functionPath: EntityDTO<FunctionPathEntity> = {
  id: 'function-path-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first_function_path',
  label: 'First Function Path',
  function: { id: 'function-1' } as any,
  assistant: { id: 'assistant-1' } as any,
  environmentID: 'environment-1',
};

export const functionPathList: EntityDTO<FunctionPathEntity>[] = [
  functionPath,
  {
    ...functionPath,
    id: 'function-path-2',
    name: 'second_function_path',
    label: 'Second Function Path',
  },
];
