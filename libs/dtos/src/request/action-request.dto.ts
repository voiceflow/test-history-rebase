import { z } from 'zod';

import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const ActionRequestDTO = BaseRequestDTO.extend({
  type: z.literal(RequestType.ACTION),
  payload: z.object({
    label: z.string().optional(),
  }),
});

export type ActionRequest = z.infer<typeof ActionRequestDTO>;
