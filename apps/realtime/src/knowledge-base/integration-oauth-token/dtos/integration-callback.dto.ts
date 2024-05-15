import { z } from 'zod';

export const IntegrationCallbackParams = z.object({
  code: z.string(),
  state: z.string(),
  redirectUrl: z.string().optional(),
});

export type IntegrationCallbackParams = z.infer<typeof IntegrationCallbackParams>;
