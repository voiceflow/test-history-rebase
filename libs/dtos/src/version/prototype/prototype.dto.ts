import { z } from 'zod';

import { SurveyorContextDTO } from './surveyorContext/surveyorContext.dto';

export const PrototypeDTO = z
  .object({
    surveyorContext: SurveyorContextDTO,
  })
  .passthrough();

export type Prototype = z.infer<typeof PrototypeDTO>;
