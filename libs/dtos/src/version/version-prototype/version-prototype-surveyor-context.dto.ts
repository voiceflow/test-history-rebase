import { z } from 'zod';

import { CompiledCMSVariableDTO } from '@/variable/compiled-variable.dto';

export const VersionPrototypeSurveyorContextDTO = z
  .object({
    cmsVariables: z.record(CompiledCMSVariableDTO),
  })
  .passthrough();

export type VersionPrototypeSurveyorContext = z.infer<typeof VersionPrototypeSurveyorContextDTO>;
