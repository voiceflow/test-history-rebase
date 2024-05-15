import { z } from 'zod';

import { BaseCompiledCMSVariableDTO } from './base-variable.compiled.dto';

export const CompiledSystemCMSVariableDTO = BaseCompiledCMSVariableDTO.extend({
  isSystem: z.literal(true),
});

export type CompiledSystemCMSVariable = z.infer<typeof CompiledSystemCMSVariableDTO>;
