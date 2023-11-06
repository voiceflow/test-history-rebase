import { z } from 'zod';

import { ButtonDTO, TraceDTOFactory, TraceType } from './utils.dto';

export const ChoiceTraceDTO = TraceDTOFactory(TraceType.CHOICE, {
  payload: z.object({
    buttons: z.array(ButtonDTO),
  }),
});

export type ChoiceTrace = z.infer<typeof ChoiceTraceDTO>;
