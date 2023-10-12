import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { MetricsInterceptor, MetricsModule as BaseMetricsModule } from '@voiceflow/nestjs-metrics';

import { EnvironmentVariables } from '@/app.env';
import { APP_NAME, METRICS_INTERVAL } from '@/config';

@Module({
  imports: [
    BaseMetricsModule.registerAsync({
      inject: [ENVIRONMENT_VARIABLES],
      useFactory: (env: EnvironmentVariables) => ({
        interval: METRICS_INTERVAL,
        port: env.PORT_METRICS,
        serviceName: APP_NAME,
      }),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class MetricsModule {}
