import { z } from 'zod';

import { VariableDatatype } from '../variable-datatype.enum';
import { BaseCompiledCMSVariableDTO } from './base-variable.compiled.dto';

export const CompiledUserCMSVariableDTO = BaseCompiledCMSVariableDTO.extend({
  isSystem: z.literal(false),
  datatype: z.nativeEnum(VariableDatatype),
  isArray: z.boolean(),
});

export type CompiledUserCMSVariable = z.infer<typeof CompiledUserCMSVariableDTO>;
