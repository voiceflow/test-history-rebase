import { z } from 'zod';

export const BaseRequestButtonDTO = z.object({
  name: z.string(),
});

export type BaseRequestButton = z.infer<typeof BaseRequestButtonDTO>;
