import { z } from 'zod';

export const RequestConfigDTO = z.object({
  tts: z.boolean().optional(),
  stopAll: z.boolean().optional(),
  stripSSML: z.boolean().optional(),
  stopTypes: z.array(z.string()).optional(),
  selfDelegate: z.boolean().optional(),
  excludeTypes: z.array(z.string()).optional(),
});

export type RequestConfig = z.infer<typeof RequestConfigDTO>;
