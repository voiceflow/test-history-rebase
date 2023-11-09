import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

export const EventMappingDTO = CMSObjectResourceDTO.extend({
  path: MarkupDTO,
  eventID: z.string(),
  variableID: z.string().nullable(),
  assistantID: z.string(),
  environmentID: z.string(),
}).strict();

export type EventMapping = z.infer<typeof EventMappingDTO>;
