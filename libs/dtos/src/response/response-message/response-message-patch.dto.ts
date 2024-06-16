import type { z } from 'zod';

import { ResponseMessageDTO } from './response-message.dto';

export const ResponseMessagePatchDTO = ResponseMessageDTO.pick({
  text: true,
  condition: true,
})
  .strict()
  .partial();

export type ResponseMessagePatch = z.infer<typeof ResponseMessagePatchDTO>;
