import type { EntityDTO } from '@mikro-orm/core';

import type { VariableEntity } from './variable.entity';
import { VariableDatatype } from './variable-datatype.enum';

export const variable: EntityDTO<VariableEntity> = {
  id: 'variable-1',
  name: 'global variable',
  defaultValue: '123',
  createdAt: new Date(),
  updatedAt: new Date(),
  datatype: VariableDatatype.NUMBER,
  description: 'description',
  isSystem: false,
  isArray: false,
  color: '#000000',
  assistant: { id: 'assistant-1' } as any,
  createdByID: 1,
  updatedByID: 2,
  folder: null,
  environmentID: 'environment-1',
};

export const variableList: EntityDTO<VariableEntity>[] = [
  variable,
  {
    ...variable,
    id: 'variable-2',
    name: 'local variable',
    defaultValue: '456',
  },
];
