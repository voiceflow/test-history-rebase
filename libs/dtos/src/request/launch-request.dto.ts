import { z } from 'zod';

import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const LaunchRequestDTO = BaseRequestDTO.extend({
  type: z.literal(RequestType.LAUNCH),
  payload: z
    .object({
      persona: z.string().optional(),
    })
    .optional(),
});

export type LaunchRequest = z.infer<typeof LaunchRequestDTO>;
