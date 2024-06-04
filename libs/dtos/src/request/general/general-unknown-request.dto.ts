import { z } from 'zod';

import { RequestType } from '../request-type.enum';
import { BaseRequestDTO } from '../utils.dto';

export const GeneralUnknownRequestDTO = BaseRequestDTO.extend({
  type: z.string().refine((val) => !Object.values<string>(RequestType).includes(val)),
  payload: z.unknown().optional(),
}).passthrough();

export type GeneralUnknownRequest = z.infer<typeof GeneralUnknownRequestDTO>;

