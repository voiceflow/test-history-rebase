import type { EntityDTO } from '@mikro-orm/core';

import type { FunctionEntity } from './function.entity';

export const function_: EntityDTO<FunctionEntity> = {
  id: 'function-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'first function',
  description: 'function description',
  code: 'var x = 123;',
  image: null,
  paths: [],
  variables: [],
  assistant: { id: 'assistant-1' } as any,
  createdByID: 1,
  updatedByID: 2,
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
