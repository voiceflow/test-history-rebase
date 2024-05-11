import { IntegrationData } from '@voiceflow/dtos';
import { z } from 'zod';

export const IntegrationFindManyResponse = z.object({
  data: z.array(IntegrationData).optional(),
});

export type IntegrationFindManyResponse = z.infer<typeof IntegrationFindManyResponse>;
