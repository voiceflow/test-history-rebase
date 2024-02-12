import { z } from 'zod';

import { CompiledCMSVariableMapDTO } from './cmsVariables.dto';

export const SurveyorContextDTO = z
  .object({
    cmsVariables: CompiledCMSVariableMapDTO.optional(),
  })
  .passthrough();

export type SurveyorContext = z.infer<typeof SurveyorContextDTO>;
