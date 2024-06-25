import { BaseEnvironmentVariables } from '@voiceflow/nestjs-common';
import { AuthEnvironmentVariables } from '@voiceflow/sdk-auth/nestjs';
import { BillingEnvironmentVariables } from '@voiceflow/sdk-billing/nestjs';
import { z } from 'nestjs-zod/z';

export const EnvironmentVariables = BaseEnvironmentVariables.extend({
  /* ports */
  PORT: z.string().transform(Number),

  // temporary placeholder until added by infra
  LOG_FORMAT: z.string().optional().default('inline'),

  /* redis */
  REDIS_CLUSTER_HOST: z.string(),
  REDIS_CLUSTER_PORT: z.string().transform(Number),

  /* google */
  FIRESTORE_MODEL_COLLECTION: z.string(),
  FIRESTORE_GPTPROMPT_COLLECTION: z.string().optional().default('gpt-prompts'),
  PUBSUB_PROJECT_KEY: z.string().optional(),

  /* OpenAI */
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_API_ENDPOINT: z.string().optional(),

  /* Azure OpenAI */
  AZURE_ENDPOINT: z.string().optional(),
  AZURE_OPENAI_API_KEY: z.string().optional(),

  /* Anthropic */
  ANTHROPIC_API_KEY: z.string().optional(),

  /* Google */
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),

  /* request throttler */
  REQUEST_THROTTLER_TTL: z.string().optional().default('60000').transform(Number),
  REQUEST_THROTTLER_LIMIT: z.string().optional().default('1000').transform(Number),
})
  .extend(AuthEnvironmentVariables.shape)
  .extend(BillingEnvironmentVariables.shape);

export type EnvironmentVariables = z.infer<typeof EnvironmentVariables>;
