import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

export const AssistantDTO = CMSObjectResourceDTO.extend({
  name: z.string(),
  workspaceID: z.string(),
  activePersonaID: z.string().nullable(),
  activeEnvironmentID: z.string(),
}).strict();

export type Assistant = z.infer<typeof AssistantDTO>;
