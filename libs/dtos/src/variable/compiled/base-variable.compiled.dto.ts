import { z } from 'zod';

export const BaseCompiledCMSVariableDTO = z.object({
  isSystem: z.boolean(),
  defaultValue: z.string().nullable(),
});

export type BaseCompiledCMSVariable = z.infer<typeof BaseCompiledCMSVariableDTO>;
