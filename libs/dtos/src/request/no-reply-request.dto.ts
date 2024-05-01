import { z } from 'zod';

import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const NoReplyRequestDTO = BaseRequestDTO.omit({ payload: true })
  .extend({
    type: z.literal(RequestType.NO_REPLY),
  })
  .passthrough();

export type NoReplyRequest = z.infer<typeof NoReplyRequestDTO>;

export const isNoReplyRequest = (value: unknown): value is NoReplyRequest => NoReplyRequestDTO.safeParse(value).success;
