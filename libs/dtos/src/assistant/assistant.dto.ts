import { z } from 'zod';

import { CMSObjectResourceDTO } from '@/common';

export const AssistantDTO = CMSObjectResourceDTO.extend({
  name: z.string().min(1, 'Name is required.').max(255, 'Name is too long.'),
  workspaceID: z.string(),
  activeEnvironmentID: z.string(),
}).strict();

export type Assistant = z.infer<typeof AssistantDTO>;
