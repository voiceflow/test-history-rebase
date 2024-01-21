import { z } from 'zod';

import { AIMessageRole } from './ai-message-role.enum';

export const AIMessageDTO = z.object({
  role: z.nativeEnum(AIMessageRole),
  content: z.string(),
});

export type AIMessage = z.infer<typeof AIMessageDTO>;
