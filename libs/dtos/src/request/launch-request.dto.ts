import { z } from 'zod';

import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

// change dtos
export const LaunchRequestDTO = BaseRequestDTO.extend({
  type: z.literal(RequestType.LAUNCH),
  payload: z
    .object({
      persona: z.string().optional(),
    })
    .passthrough()
    .optional(),
}).passthrough();

export type LaunchRequest = z.infer<typeof LaunchRequestDTO>;

export const isLaunchRequest = (value: unknown): value is LaunchRequest => LaunchRequestDTO.safeParse(value).success;
