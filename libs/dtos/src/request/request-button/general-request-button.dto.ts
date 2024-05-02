import type { z } from 'zod';

import { GeneralRequestDTO } from '../general/general-request.dto';
import { BaseRequestButtonDTO } from './base-request-button.dto';

export const GeneralRequestButtonDTO = BaseRequestButtonDTO.extend({
  request: GeneralRequestDTO,
});

export type GeneralRequestButton = z.infer<typeof GeneralRequestButtonDTO>;
