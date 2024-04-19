import { z } from 'nestjs-zod/z';

export const DesignerEnvironmentVariables = z.object({
  REALTIME_API_SERVICE_URI: z.string(),
  REALTIME_API_SERVICE_PORT: z.string().transform(Number),
});

export type DesignerEnvironmentVariables = z.infer<typeof DesignerEnvironmentVariables>;
