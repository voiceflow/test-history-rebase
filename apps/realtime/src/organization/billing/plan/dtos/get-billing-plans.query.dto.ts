import { PlanName } from '@voiceflow/dtos';
import { z } from 'nestjs-zod/z';

export const GetBillingPlansQuery = z.object({
  planIDs: z.array(z.nativeEnum(PlanName)),
  coupons: z.array(z.string()).optional(),
});

export type GetBillingPlansQuery = z.infer<typeof GetBillingPlansQuery>;
