import { z } from 'zod';

import { ResourceLevel } from './quota-resource-level.enum';

export const QuotaDetailsDTO = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  description: z.string().optional(),
  defaultQuota: z.number(),
  resourceLevel: z.nativeEnum(ResourceLevel),
});

export const QuotaDTO = z.object({
  quota: z.number(),
  period: z.number(),
  consumed: z.number(),
  lastReset: z.string(),
  quotaDetails: QuotaDetailsDTO,
});

export type Quota = z.infer<typeof QuotaDTO>;
export type QuotaDetails = z.infer<typeof QuotaDetailsDTO>;
