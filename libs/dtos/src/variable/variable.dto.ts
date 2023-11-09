import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { SystemVariable } from './system-variable.enum';
import { VariableDatatype } from './variable-datatype.enum';

export const VariableDTO = CMSTabularResourceDTO.extend({
  color: z.string(),
  system: z.nativeEnum(SystemVariable).nullable(),
  isArray: z.boolean(),
  datatype: z.nativeEnum(VariableDatatype),
  description: z.string().nullable(),
  defaultValue: z.string().nullable(),
}).strict();

export type Variable = z.infer<typeof VariableDTO>;
