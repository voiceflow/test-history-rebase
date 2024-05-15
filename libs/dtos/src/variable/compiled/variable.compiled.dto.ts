import { z } from 'zod';

import { CompiledSystemCMSVariableDTO } from './system-variable.compiled.dto';
import { CompiledUserCMSVariableDTO } from './user-variable.compiled.dto';

export type { CompiledSystemCMSVariable } from './system-variable.compiled.dto';
export { CompiledSystemCMSVariableDTO } from './system-variable.compiled.dto';
export type { CompiledUserCMSVariable } from './user-variable.compiled.dto';
export { CompiledUserCMSVariableDTO } from './user-variable.compiled.dto';

export const CompiledCMSVariableDTO = z.discriminatedUnion('isSystem', [
  CompiledSystemCMSVariableDTO,
  CompiledUserCMSVariableDTO,
]);

export type CompiledCMSVariable = z.infer<typeof CompiledCMSVariableDTO>;
