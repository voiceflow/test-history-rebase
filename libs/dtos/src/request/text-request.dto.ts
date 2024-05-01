import { z } from 'zod';

import { RequestType } from './request-type.enum';
import { BaseRequestDTO } from './utils.dto';

export const TextRequestDTO = BaseRequestDTO.extend({
  type: z.literal(RequestType.TEXT),
  payload: z.string(),
}).passthrough();

export type TextRequest = z.infer<typeof TextRequestDTO>;

export const isTextRequest = (value: unknown): value is TextRequest => TextRequestDTO.safeParse(value).success;
