import { z } from 'zod';

import { PrototypeIntentDTO, PrototypeSlotDTO } from '@/common';
import { CompiledCMSVariableDTO } from '@/variable/compiled-variable.dto';

export const VersionPrototypeSurveyorContextDTO = z
  .object({
    platform: z.string(),
    slotsMap: z.record(PrototypeSlotDTO),
    extraSlots: z.array(PrototypeSlotDTO),
    extraIntents: z.array(PrototypeIntentDTO),
    cmsVariables: z.record(CompiledCMSVariableDTO).optional(),
    usedIntentsSet: z.array(z.string()),
    usedFunctionsMap: z.record(z.string()).optional(),
  })
  .passthrough();

export type VersionPrototypeSurveyorContext = z.infer<typeof VersionPrototypeSurveyorContextDTO>;
