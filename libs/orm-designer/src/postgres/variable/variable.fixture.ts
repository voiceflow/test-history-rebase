import type { EntityDTO } from '@mikro-orm/core';
import { VariableDatatype } from '@voiceflow/dtos';

import type { VariableEntity } from './variable.entity';

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
  createdBy: { id: 1 } as any,
  updatedBy: { id: 2 } as any,
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
