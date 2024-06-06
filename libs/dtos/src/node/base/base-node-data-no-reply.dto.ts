import { z } from 'zod';

import { BaseNodeDataPathDTO } from './base-node-data-path.dto';

export const BaseNodeDataNoReplyDTO = BaseNodeDataPathDTO.extend({
  repromptID: z.string().nullable(),
  inactivityTime: z.number().nullable().optional(),
}).strict();

export type BaseNodeDataNoReply = z.infer<typeof BaseNodeDataNoReplyDTO>;
