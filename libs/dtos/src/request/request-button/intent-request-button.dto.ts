import { z } from 'zod';

import { IntentRequestDTO } from '../intent/intent-request.dto';

export const IntentRequestButtonDTO = z.object({
  request: IntentRequestDTO,
});

export type IntentRequestButton = z.infer<typeof IntentRequestButtonDTO>;
