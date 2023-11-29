import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { SystemVariable } from './system-variable.enum';
import { VariableDatatype } from './variable-datatype.enum';
import { VariableNameTransformDTO } from './variable-name.dto';

export const VariableDTO = CMSTabularResourceDTO.extend({
  name: VariableNameTransformDTO.refine((value) => value.length > 0, 'Name is required').refine(
    (value) => value.length <= 32,
    'Name cannot exceed 32 characters'
  ),
  color: z.string(),
  system: z.nativeEnum(SystemVariable).nullable(),
  isArray: z.boolean(),
  datatype: z.nativeEnum(VariableDatatype),
  description: z.string().nullable(),
  defaultValue: z.string().nullable(),
}).strict();

export type Variable = z.infer<typeof VariableDTO>;
