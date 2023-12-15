import { z } from 'nestjs-zod/z';

export const MLGatewayEnvironmentVariables = z.object({
  ML_GATEWAY_SERVICE_HOST: z.string(),
  ML_GATEWAY_SERVICE_PORT: z.string().transform(Number),
});

export type MLGatewayEnvironmentVariables = z.infer<typeof MLGatewayEnvironmentVariables>;
