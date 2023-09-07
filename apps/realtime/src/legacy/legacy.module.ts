import { Module } from '@nestjs/common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { LoguxServer } from '@voiceflow/nestjs-logux';

import { EnvironmentVariables } from '@/app.env';
import IOServer from '@/ioServer';

import { LegacyService } from './legacy.service';

@Module({
  providers: [
    {
      provide: LegacyService,
      inject: [LoguxServer, ENVIRONMENT_VARIABLES],
      useFactory: (server: LoguxServer, env: EnvironmentVariables) => {
        const ioServer = new IOServer({
          env: env.NODE_ENV,
          port: env.PORT_IO,
        });

        return new LegacyService(server, ioServer, env).init();
      },
    },
  ],
})
export class LegacyModule {}
