import { BillingPlanDTO } from '@voiceflow/dtos';
import { z } from 'nestjs-zod/z';

export const GetBillingPlansResponse = z.array(BillingPlanDTO);
