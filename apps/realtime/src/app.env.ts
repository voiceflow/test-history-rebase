import { BaseEnvironmentVariables } from '@voiceflow/nestjs-common';
import { AuthEnvironmentVariables } from '@voiceflow/sdk-auth/nestjs';
import { BillingEnvironmentVariables } from '@voiceflow/sdk-billing/nestjs';
import { IdentityEnvironmentVariables } from '@voiceflow/sdk-identity/nestjs';
import { RabbitMQConnectionEnvironmentVariables } from '@voiceflow/sdk-message-queue/nestjs';
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
  HASHED_ID_SALT: z.string(),
  HASHED_WORKSPACE_ID_SALT: z.string(),

  /* backend endpoints */
  CREATOR_API_ENDPOINT: z.string(),
  ALEXA_SERVICE_ENDPOINT: z.string(),
  GENERAL_SERVICE_ENDPOINT: z.string(),
  IDENTITY_API_ENDPOINT: z.string(),
  BILLING_API_ENDPOINT: z.string(),

  KL_PARSER_SERVICE_HOST: z.string(),
  KL_PARSER_SERVICE_PORT: z.string(),

  /* frontend endpoints */
  CREATOR_APP_PUBLIC_ENDPOINT: z.string(),

  /* aws */
  AWS_REGION: z.string(),

  /* s3 */
  S3_ENDPOINT: z.string(),
  S3_URL_FORMAT: z.string(),
  S3_IMAGE_BUCKET: z.string(),
  S3_KNOWLEDGE_BASE_BUCKET: z.string().optional().default('dev-voiceflow-knowledgebase'),
  S3_PROJECT_BACKUPS_BUCKET: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_DEFAULT_MAX_FILE_SIZE_MB: z.string().optional().default('10').transform(Number),

  /* sendgrid */
  SENDGRID_KEY: z.string(),

  /* request throttler */
  REQUEST_THROTTLER_TTL: z.string().optional().default('60000').transform(Number),
  REQUEST_THROTTLER_LIMIT: z.string().optional().default('1000').transform(Number),

  /* aes encryption secret key  */
  AES_SECRET_KEY: z.string(),

  /* integrations  */
  ZENDESK_OAUTH_CLIENT_ID: z.string(),
  ZENDESK_OAUTH_CLIENT_SECRET: z.string(),
})
  .extend(AuthEnvironmentVariables.shape)
  .extend(BillingEnvironmentVariables.shape)
  .extend(IdentityEnvironmentVariables.shape)
  .extend(RabbitMQConnectionEnvironmentVariables.shape);

export type EnvironmentVariables = z.infer<typeof EnvironmentVariables>;
