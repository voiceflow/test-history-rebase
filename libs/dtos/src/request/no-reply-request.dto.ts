import { z } from 'zod';

import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const NoReplyRequestDTO = BaseRequestDTO
  .extend({
    type: z.literal(RequestType.NO_REPLY),
    payload: z.never().optional()
  })
  .passthrough();

export type NoReplyRequest = z.infer<typeof NoReplyRequestDTO>;

export const isNoReplyRequest = (value: unknown): value is NoReplyRequest => NoReplyRequestDTO.safeParse(value).success;
