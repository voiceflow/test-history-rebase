import { z } from 'zod';

import { CMSObjectResourceDTO, MarkupDTO } from '@/common';

export const EventMappingDTO = CMSObjectResourceDTO.partial({
  updatedAt: true,
  updatedByID: true,
})
  .extend({
    path: MarkupDTO,
    eventID: z.string(),
    variableID: z.string().nullable(),
    assistantID: z.string().optional(),
    environmentID: z.string().optional(),
  })
  .strict();

export type EventMapping = z.infer<typeof EventMappingDTO>;
