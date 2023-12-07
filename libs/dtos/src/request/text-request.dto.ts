import { z } from 'zod';

import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const TextRequestDTO = BaseRequestDTO.extend({
  type: z.literal(RequestType.TEXT),
  payload: z.string(),
});

export type TextRequest = z.infer<typeof TextRequestDTO>;
