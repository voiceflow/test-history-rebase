import type { EntityDTO } from '@mikro-orm/core';

import type { FunctionEntity } from './function.entity';

export const function_: EntityDTO<FunctionEntity> = {
  id: 'function-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first function',
  description: 'function description',
  pathOrder: ['function-path-1'],
  code: 'var x = 123;',
  image: null,
  assistant: { id: 'assistant-1' } as any,
  createdBy: { id: 1 } as any,
  updatedBy: { id: 2 } as any,
  folder: null,
  environmentID: 'environment-1',
};

export const functionList: EntityDTO<FunctionEntity>[] = [
  function_,
  {
    ...function_,
    id: 'function-2',
    name: 'second function',
    description: null,
    code: 'var foo = "bar";',
    image: 'https://example.com/image.png',
  },
];
