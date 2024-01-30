import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { VARIABLE_NAME_MAX_LENGTH } from './variable.constant';
import { VariableDatatype } from './variable-datatype.enum';
import { VariableNameTransformDTO } from './variable-name.dto';

export const VariableDTO = CMSTabularResourceDTO.extend({
  name: VariableNameTransformDTO.refine((value) => value.length > 0, 'Name is required.').refine(
    (value) => value.length <= VARIABLE_NAME_MAX_LENGTH,
    'Name cannot exceed 64 characters.'
  ),
  color: z.string(),
  isArray: z.boolean(),
  isSystem: z.boolean(),
  datatype: z.nativeEnum(VariableDatatype),
  description: z.string().nullable(),
  defaultValue: z.string().nullable(),
}).strict();

export type Variable = z.infer<typeof VariableDTO>;
