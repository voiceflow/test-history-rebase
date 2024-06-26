import type { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import { Server } from 'socket.io';

import type { EnvironmentVariables } from '../app.env';

@Injectable()
export class IOServer extends Server implements OnApplicationShutdown, OnApplicationBootstrap {
  constructor(@Inject(ENVIRONMENT_VARIABLES) private readonly env: EnvironmentVariables) {
    super({
      allowEIO3: true,
      transports: ['websocket'],
      pingTimeout: 10000,
      pingInterval: 5000,
    });
  }

  onApplicationBootstrap() {
    if (this.env.NODE_ENV === 'e2e') {
      const httpsServer = createServer({
        key: readFileSync('certs/localhost.key'),
        cert: readFileSync('certs/localhost.crt'),
      });

      this.listen(httpsServer);

      httpsServer.listen(this.env.PORT_IO);
    } else {
      this.listen(this.env.PORT_IO);
    }
  }

  onApplicationShutdown() {
    this.close();
  }
}
