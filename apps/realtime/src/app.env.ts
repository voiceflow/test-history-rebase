import { BaseEnvironmentVariables } from '@voiceflow/nestjs-common';
import { AuthEnvironmentVariables } from '@voiceflow/sdk-auth/nestjs';
import { BillingEnvironmentVariables } from '@voiceflow/sdk-billing/nestjs';
import { IdentityEnvironmentVariables } from '@voiceflow/sdk-identity/nestjs';
import { z } from 'nestjs-zod/z';

export const EnvironmentVariables = BaseEnvironmentVariables.extend({
  /* ports */
  PORT_HTTP: z.string().transform(Number),
  PORT_IO: z.string().transform(Number),

  /* redis */
  REDIS_CLUSTER_HOST: z.string(),
  REDIS_CLUSTER_PORT: z.string().transform(Number),

  /* logux */
  LOGUX_ACTION_CHANNEL: z.string(),

  /* postgres */
  POSTGRES_HOST: z.string(),
  POSTGRES_USERNAME: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_PORT: z.string().transform(Number),

  /* unleash */
  UNLEASH_URL: z.string(),
  UNLEASH_API_KEY: z.string(),

  /* environment */
  CLOUD_ENV: z.string(),
  DEPLOY_ENV: z.string(),

  /* mongo */
  MONGO_DB: z.string(),
  MONGO_URI: z.string(),

  /* hashed ids */
  TEAM_HASH: z.string(),
  /* TODO: remove optional() after environment variables updated */
  HASHED_ID_SALT: z.string().optional(),
  HASHED_WORKSPACE_ID_SALT: z.string().optional(),

  /* endpoints */
  CREATOR_API_ENDPOINT: z.string(),
  ALEXA_SERVICE_ENDPOINT: z.string(),
  GOOGLE_SERVICE_ENDPOINT: z.string(),
  GENERAL_SERVICE_ENDPOINT: z.string(),
  IDENTITY_API_ENDPOINT: z.string(),
  BILLING_API_ENDPOINT: z.string(),

  /* aws */
  /* TODO: remove optional() after environment variables updated */
  AWS_REGION: z.string().optional(),

  /* s3 */
  /* TODO: remove optional() after environment variables updated */
  S3_ENDPOINT: z.string().optional(),
  S3_URL_FORMAT: z.string().optional(),
  S3_IMAGE_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
})
  .extend(AuthEnvironmentVariables.shape)
  .extend(BillingEnvironmentVariables.shape)
  .extend(IdentityEnvironmentVariables.shape);

export type EnvironmentVariables = z.infer<typeof EnvironmentVariables>;
