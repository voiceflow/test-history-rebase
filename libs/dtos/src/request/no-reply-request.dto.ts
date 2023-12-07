import { z } from 'zod';

import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const NoReplyRequestDTO = BaseRequestDTO.extend({
  type: z.literal(RequestType.NO_REPLY),
});

export type NoReplyRequest = z.infer<typeof NoReplyRequestDTO>;
