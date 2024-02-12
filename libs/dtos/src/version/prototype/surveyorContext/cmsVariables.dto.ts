import { z } from 'zod';

import { CompiledCMSVariableDTO } from '@/variable/compiled-variable.dto';

export const CompiledCMSVariableMapDTO = z.record(CompiledCMSVariableDTO);

export type CompiledCMSVariableMap = z.infer<typeof CompiledCMSVariableMapDTO>;
