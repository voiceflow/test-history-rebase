import { z } from 'zod';

import { BaseNodeDataPathDTO } from './base-node-data-path.dto';

export const BaseNodeDataNoMatchDTO = BaseNodeDataPathDTO.extend({
  repromptID: z.string().nullable(),
}).strict();

export type BaseNodeDataNoMatch = z.infer<typeof BaseNodeDataNoMatchDTO>;
