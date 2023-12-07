import { z } from 'zod';

export const BaseRequestDTO = z.object({
  type: z.string(),
  payload: z.any().optional(), // payload can be string or object
  diagramID: z.string().optional(),
});

export type BaseRequest = z.infer<typeof BaseRequestDTO>;
