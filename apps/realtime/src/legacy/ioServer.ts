import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { readFileSync } from 'fs';
import { createServer, Server as HTTPServer } from 'https';
import { Server } from 'socket.io';

import { EnvironmentVariables } from '../app.env';

@Injectable()
export class IOServer extends Server implements OnApplicationShutdown {
  constructor(@Inject(ENVIRONMENT_VARIABLES) env: EnvironmentVariables) {
    let server: HTTPServer | number;

    if (env.NODE_ENV === 'e2e') {
      server = createServer({
        key: readFileSync('certs/localhost.key'),
        cert: readFileSync('certs/localhost.crt'),
      });
      server.listen(env.PORT_IO);
    } else {
      server = env.PORT_IO;
    }

    super(server, {
      allowEIO3: true,
      transports: ['websocket'],
      pingTimeout: 10000,
      pingInterval: 5000,
    });
  }

  onApplicationShutdown() {
    this.close();
  }
}
