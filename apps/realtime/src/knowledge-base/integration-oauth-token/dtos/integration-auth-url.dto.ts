import { z } from 'zod';

export const IntegrationAuthUrlResponse = z.object({
  data: z.object({
    url: z.string(),
  }),
});

export type IntegrationAuthUrlResponse = z.infer<typeof IntegrationAuthUrlResponse>;

export const IntegrationAuthUrlParams = z.object({
  redirectUrl: z.string().optional(),
  subdomain: z.string().optional(),
});

export type IntegrationAuthUrlParams = z.infer<typeof IntegrationAuthUrlParams>;
