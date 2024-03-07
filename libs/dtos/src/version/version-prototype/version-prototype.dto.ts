import { z } from 'zod';

import { VersionPrototypeSurveyorContextDTO } from './version-prototype-surveyor-context.dto';

export const VersionPrototypeDTO = z
  .object({
    surveyorContext: VersionPrototypeSurveyorContextDTO,
  })
  .passthrough();

export type VersionPrototype = z.infer<typeof VersionPrototypeDTO>;
