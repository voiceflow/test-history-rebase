import { z } from 'zod';

import { GeneralRequestDTO } from '../general/general-request.dto';

export const GeneralRequestButtonDTO = z.object({
  request: GeneralRequestDTO,
});

export type GeneralRequestButton = z.infer<typeof GeneralRequestButtonDTO>;
