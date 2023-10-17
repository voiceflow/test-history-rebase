import { DEFAULT_REDIS_NAMESPACE, RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Environment } from '@voiceflow/common';
import { HashedIDModule, HealthModule, InternalExceptionFilter, LoggerOptions, ZodValidationExceptionFilter } from '@voiceflow/nestjs-common';
import { ENVIRONMENT_VARIABLES, EnvModule } from '@voiceflow/nestjs-env';
import { LoguxModule, SyncModule } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { setAuthenticationTokenContext } from '@voiceflow/sdk-auth/logux';
import { AuthGuard, AuthModule } from '@voiceflow/sdk-auth/nestjs';
import { BillingModule } from '@voiceflow/sdk-billing/nestjs';
import { IdentityModule } from '@voiceflow/sdk-identity/nestjs';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';

import { EnvironmentVariables } from './app.env';
import { AssistantModule } from './assistant/assistant.module';
import { AttachmentModule } from './attachment/attachment.module';
import { SerializerModule } from './common';
import { PUBLISHER_REDIS_NAMESPACE, SUBSCRIBER_REDIS_NAMESPACE } from './config';
import { CreatorModule } from './creator/creator.module';
import { DiagramModule } from './diagram/diagram.module';
import { EntityModule } from './entity/entity.module';
import { FileModule } from './file/file.module';
import { IntentModule } from './intent/intent.module';
import { LegacyModule } from './legacy/legacy.module';
import { createPostgresConfig } from './mikro-orm/postgres.config';
import { ProjectModule } from './project/project.module';
import { ProjectListModule } from './project-list/project-list.module';
import { PromptModule } from './prompt/prompt.module';
import { ResponseModule } from './response/response.module';
import { StoryModule } from './story/story.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { VersionModule } from './version/version.module';

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
          { host: env.REDIS_CLUSTER_HOST, port: env.REDIS_CLUSTER_PORT, namespace: PUBLISHER_REDIS_NAMESPACE },
          { host: env.REDIS_CLUSTER_HOST, port: env.REDIS_CLUSTER_PORT, namespace: SUBSCRIBER_REDIS_NAMESPACE },
        ],
      }),
    }),
    AuthModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => AuthModule.optionsFactory(env.AUTH_API_SERVICE_HOST, env.AUTH_API_SERVICE_PORT_APP),
    }),
    IdentityModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => IdentityModule.optionsFactory(env.IDENTITY_API_SERVICE_HOST, env.IDENTITY_API_SERVICE_PORT_APP),
    }),
    BillingModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => BillingModule.optionsFactory(env.IDENTITY_API_SERVICE_HOST, env.IDENTITY_API_SERVICE_PORT_APP),
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
          const creatorID = Number(userId);

          if (Number.isNaN(creatorID)) return false;

          const user = await userService.getByToken(token);

          if (user?.id !== creatorID) return false;

          setAuthenticationTokenContext(client, token);

          return true;
        },
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
    CreatorModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        baseURL: env.CREATOR_API_ENDPOINT,
      }),
    }),
    FileModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        region: env.AWS_REGION,
        format: env.S3_URL_FORMAT,
        buckets: { image: env.S3_IMAGE_BUCKET },
        endpoint: env.S3_ENDPOINT,
        accessKeyID: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        defaultMaxFileSizeMB: env.S3_DEFAULT_MAX_FILE_SIZE_MB,
      }),
    }),
    SerializerModule,
    LegacyModule,
    UserModule,
    StoryModule,
    EntityModule,
    IntentModule,
    PromptModule,
    UploadModule,
    ResponseModule,
    AssistantModule,
    AttachmentModule,
    ProjectListModule,
    DiagramModule,
    VersionModule,
    ProjectModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
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
