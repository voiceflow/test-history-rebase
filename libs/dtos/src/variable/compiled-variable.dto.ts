import { z } from 'zod';

import { VariableDatatype } from './variable-datatype.enum';

export const BaseCompiledCMSVariableDTO = z.object({
  isSystem: z.boolean(),
  defaultValue: z.string(),
});

export type BaseCompiledCMSVariable = z.infer<typeof BaseCompiledCMSVariableDTO>;

export const CompiledSystemCMSVariableDTO = BaseCompiledCMSVariableDTO.extend({
  isSystem: z.literal(true),
});

export type CompiledSystemCMSVariable = z.infer<typeof CompiledSystemCMSVariableDTO>;

export const CompiledUserCMSVariableDTO = BaseCompiledCMSVariableDTO.extend({
  isSystem: z.literal(false),
  datatype: z.nativeEnum(VariableDatatype),
  isArray: z.boolean(),
});

export type CompiledUserCMSVariable = z.infer<typeof CompiledUserCMSVariableDTO>;

export const CompiledCMSVariableDTO = z.discriminatedUnion('isSystem', [
  CompiledSystemCMSVariableDTO,
  CompiledUserCMSVariableDTO,
]);

export type CompiledCMSVariable = z.infer<typeof CompiledCMSVariableDTO>;
