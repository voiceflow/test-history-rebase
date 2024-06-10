import { z } from 'zod';

import { CMSTabularResourceDTO } from '@/common';

import { ResponseType } from './response-type.enum';

export const ResponseDTO = CMSTabularResourceDTO.extend({
  type: z.nativeEnum(ResponseType).nullable().optional(),
}).strict();

export type Response = z.infer<typeof ResponseDTO>;
