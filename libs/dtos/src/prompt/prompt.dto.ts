import { z } from 'zod';

import { CMSTabularResourceDTO, MarkupDTO } from '@/common';

export const PromptDTO = CMSTabularResourceDTO.extend({
  text: MarkupDTO,
  personaID: z.string().nullable(),
}).strict();

export type Prompt = z.infer<typeof PromptDTO>;
