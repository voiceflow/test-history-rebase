import { DEFAULT_REDIS_NAMESPACE, RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { Environment } from '@voiceflow/common';
import {
  HashedIDModule,
  HealthModule,
  InternalExceptionFilter,
  LoggerOptions,
  UnleashFeatureFlagModule,
  ZodValidationExceptionFilter,
} from '@voiceflow/nestjs-common';
import { ENVIRONMENT_VARIABLES, EnvModule } from '@voiceflow/nestjs-env';
import { LoguxModule, SyncModule } from '@voiceflow/nestjs-logux';
import { SendgridModule } from '@voiceflow/nestjs-sendgrid';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { setAuthenticationTokenContext } from '@voiceflow/sdk-auth/logux';
import { AuthGuard, AuthModule } from '@voiceflow/sdk-auth/nestjs';
import { BillingModule } from '@voiceflow/sdk-billing/nestjs';
import { IdentityModule } from '@voiceflow/sdk-identity/nestjs';
import type { Request } from 'express';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

import { EnvironmentVariables } from './app.env';
import { AssistantModule } from './assistant/assistant.module';
import { AttachmentModule } from './attachment/attachment.module';
import { BackupModule } from './backup/backup.module';
import { SerializerModule, ThrottlerGuard } from './common';
import { PUBLISHER_REDIS_NAMESPACE, SUBSCRIBER_REDIS_NAMESPACE, THROTTLER_REDIS_NAMESPACE } from './config';
import { CreatorModule } from './creator/creator.module';
import { CreatorAppModule } from './creator-app/creator-app.module';
import { DiagramModule } from './diagram/diagram.module';
import { EmailModule } from './email/email.module';
import { EntityModule } from './entity/entity.module';
import { EnvironmentModule } from './environment/environment.module';
import { FileModule } from './file/file.module';
import { FlowModule } from './flow/flow.module';
import { FolderModule } from './folder/folder.module';
import { FunctionModule } from './function/function.module';
import { IntentModule } from './intent/intent.module';
import { KnowledgeBaseDocumentModule } from './knowledge-base/document/document.module';
import { LegacyModule } from './legacy/legacy.module';
import { MigrationModule } from './migration/migration.module';
import { createMongoConfig } from './mikro-orm/mongo.config';
import { createPostgresConfig } from './mikro-orm/postgres.config';
import { OrganizationModule } from './organization/organization.module';
import { ProductUpdateModule } from './product-update/product-update.module';
import { ProgramModule } from './program/program.module';
import { ProjectModule } from './project/project.module';
import { ProjectPlatformModule } from './project/project-platform/project-platform.module';
import { ProjectListModule } from './project-list/project-list.module';
import { PrototypeProgramModule } from './prototype-program/prototype-program.module';
import { ResponseModule } from './response/response.module';
import { ThreadModule } from './thread/thread.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { VariableModule } from './variable/variable.module';
import { VariableStateModule } from './variable-state/variable-state.module';
import { VersionModule } from './version/version.module';
import { WorkflowModule } from './workflow/workflow.module';

@Module({
  imports: [
    EnvModule.register(EnvironmentVariables),
    HealthModule,
    // MetricsModule,
    HashedIDModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        salt: env.HASHED_ID_SALT,
        workspaceSalt: env.HASHED_WORKSPACE_ID_SALT,
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: LoggerOptions.optionsFactory,
    }),
    MikroOrmModule.forRootAsync({
      contextName: DatabaseTarget.MONGO,
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        ...createMongoConfig(env),
        registerRequestContext: false,
      }),
    }),
    MikroOrmModule.forRootAsync({
      contextName: DatabaseTarget.POSTGRES,
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        ...createPostgresConfig(env),
        registerRequestContext: false,
      }),
    }),
    MikroOrmModule.forMiddleware(),
    RedisModule.forRootAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        readyLog: env.NODE_ENV !== Environment.PRODUCTION,
        config: [
          { host: env.REDIS_CLUSTER_HOST, port: env.REDIS_CLUSTER_PORT, namespace: DEFAULT_REDIS_NAMESPACE },
          { host: env.REDIS_CLUSTER_HOST, port: env.REDIS_CLUSTER_PORT, namespace: THROTTLER_REDIS_NAMESPACE },
          { host: env.REDIS_CLUSTER_HOST, port: env.REDIS_CLUSTER_PORT, namespace: PUBLISHER_REDIS_NAMESPACE },
          { host: env.REDIS_CLUSTER_HOST, port: env.REDIS_CLUSTER_PORT, namespace: SUBSCRIBER_REDIS_NAMESPACE },
        ],
      }),
    }),
    AuthModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => AuthModule.optionsFactory(env.AUTH_API_SERVICE_URI, env.AUTH_API_SERVICE_PORT_APP),
    }),
    IdentityModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => IdentityModule.optionsFactory(env.IDENTITY_API_SERVICE_URI, env.IDENTITY_API_SERVICE_PORT_APP),
    }),
    BillingModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => BillingModule.optionsFactory(env.BILLING_API_SERVICE_URI, env.BILLING_API_SERVICE_PORT_APP),
    }),
    LoguxModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES, UserService],
      imports: [UserModule],
      useFactory: (env: EnvironmentVariables, userService: UserService) => ({
        port: env.PORT,

        ...(env.NODE_ENV === Environment.E2E && {
          key: 'certs/localhost.key',
          cert: 'certs/localhost.crt',
        }),

        authenticator: async ({ token, userId, client }) => {
          const logger = new Logger('LoguxAuthenticator');

          const creatorID = Number(userId);

          if (Number.isNaN(creatorID)) {
            // TODO: remove this temporary logging after BUG-696
            logger.warn(`[authenticator] invalid user ID: ${userId}`);
            return false;
          }

          const user = await userService.getByToken(token);

          if (user?.id !== creatorID) {
            // TODO: remove this temporary logging after BUG-696
            logger.warn({ token, user, creatorID }, `[authenticator] invalid session`);
            return false;
          }

          setAuthenticationTokenContext(client, token);

          return true;
        },

        subprotocol: Realtime.Subprotocol.CURRENT_VERSION,

        supports: '>= 1.5',

        timeout: 90000,
      }),
    }),
    SyncModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES, RedisService],
      imports: [RedisModule],
      useFactory: (env: EnvironmentVariables, redisService: RedisService) => ({
        channel: env.LOGUX_ACTION_CHANNEL,
        publisher: redisService.getClient(PUBLISHER_REDIS_NAMESPACE),
        subscriber: redisService.getClient(SUBSCRIBER_REDIS_NAMESPACE),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ENVIRONMENT_VARIABLES, RedisService],
      imports: [RedisModule],
      useFactory: (env: EnvironmentVariables, redisService: RedisService) => ({
        // disable throttling for private routes
        skipIf: (context) => context.switchToHttp().getRequest<Request>().path.startsWith('/private'),
        storage: new ThrottlerStorageRedisService(redisService.getClient(THROTTLER_REDIS_NAMESPACE)),
        throttlers: [{ ttl: env.REQUEST_THROTTLER_TTL, limit: env.REQUEST_THROTTLER_LIMIT }],
      }),
    }),
    CreatorModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        baseURL: env.CREATOR_API_ENDPOINT,
      }),
    }),
    ProjectPlatformModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        alexaBaseURL: env.ALEXA_SERVICE_ENDPOINT,
        generalBaseURL: env.GENERAL_SERVICE_ENDPOINT,
      }),
    }),
    FileModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        region: env.AWS_REGION,
        format: env.S3_URL_FORMAT,
        buckets: {
          image: env.S3_IMAGE_BUCKET,
          backup: env.S3_PROJECT_BACKUPS_BUCKET,
          kb_document: env.S3_KNOWLEDGE_BASE_BUCKET,
        },
        endpoint: env.S3_ENDPOINT,
        accessKeyID: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        defaultMaxFileSizeMB: env.S3_DEFAULT_MAX_FILE_SIZE_MB,
      }),
    }),
    UnleashFeatureFlagModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        url: env.UNLEASH_URL,
        apiKey: env.UNLEASH_API_KEY,
        appName: env.CLOUD_ENV,
        environment: env.DEPLOY_ENV,
      }),
    }),
    CreatorAppModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        baseURL: env.CREATOR_APP_PUBLIC_ENDPOINT,
      }),
    }),
    SendgridModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        apiKey: env.SENDGRID_KEY,
      }),
    }),
    EmailModule,
    SerializerModule,
    LegacyModule,
    UserModule,
    EntityModule,
    IntentModule,
    KnowledgeBaseDocumentModule,
    UploadModule,
    ResponseModule,
    AssistantModule,
    AttachmentModule,
    ProjectListModule,
    ProductUpdateModule,
    ThreadModule,
    DiagramModule,
    VersionModule,
    ProjectModule,
    MigrationModule,
    VariableStateModule,
    FunctionModule,
    EnvironmentModule,
    BackupModule,
    PrototypeProgramModule,
    OrganizationModule,
    VariableModule,
    FolderModule,
    FlowModule,
    ProgramModule,
    WorkflowModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ZodValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: InternalExceptionFilter,
    },
  ],
})
export class AppModule {}
