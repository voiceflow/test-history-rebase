import { DEFAULT_REDIS_NAMESPACE, RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { Environment } from '@voiceflow/common';
import { HealthModule, InternalExceptionFilter, LoggerOptions, ZodValidationExceptionFilter } from '@voiceflow/nestjs-common';
import { ENVIRONMENT_VARIABLES, EnvModule } from '@voiceflow/nestjs-env';
import { AuthGuard, AuthModule } from '@voiceflow/sdk-auth/nestjs';
import { BillingModule } from '@voiceflow/sdk-billing/nestjs';
import type { Request } from 'express';
import { LoggerErrorInterceptor, LoggerModule } from 'nestjs-pino';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

import { EnvironmentVariables } from './app.env';
import { ThrottlerGuard } from './common';
import { CompletionModule } from './completion/completion.module';
import { THROTTLER_REDIS_NAMESPACE } from './config';
import { GenerationModule } from './generation/generation.module';
import { NLUManagerModule } from './legacy-nlu-manager/nlu-manager.module';
import { LLMModule } from './llm/llm.module';
import { ModerationModule } from './moderation/moderation.module';

@Module({
  imports: [
    EnvModule.register(EnvironmentVariables),
    HealthModule,
    LoggerModule.forRootAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: LoggerOptions.optionsFactory,
    }),
    AuthModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => AuthModule.optionsFactory(env.AUTH_API_SERVICE_URI, env.AUTH_API_SERVICE_PORT_APP),
    }),
    BillingModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => BillingModule.optionsFactory(env.BILLING_API_SERVICE_URI, env.BILLING_API_SERVICE_PORT_APP),
    }),
    RedisModule.forRootAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        readyLog: env.NODE_ENV !== Environment.PRODUCTION,
        config: [
          { host: env.REDIS_CLUSTER_HOST, port: env.REDIS_CLUSTER_PORT, namespace: DEFAULT_REDIS_NAMESPACE },
          { host: env.REDIS_CLUSTER_HOST, port: env.REDIS_CLUSTER_PORT, namespace: THROTTLER_REDIS_NAMESPACE },
        ],
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
    LLMModule,
    CompletionModule,
    ModerationModule,
    NLUManagerModule,
    GenerationModule,
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
