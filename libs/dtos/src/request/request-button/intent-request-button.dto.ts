import type { z } from 'zod';

import { IntentRequestDTO } from '../intent/intent-request.dto';
import { BaseRequestButtonDTO } from './base-request-button.dto';

export const IntentRequestButtonDTO = BaseRequestButtonDTO.extend({
  request: IntentRequestDTO,
});

export type IntentRequestButton = z.infer<typeof IntentRequestButtonDTO>;
