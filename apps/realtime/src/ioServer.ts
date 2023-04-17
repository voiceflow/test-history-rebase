import { readFileSync } from 'fs';
import { createServer, Server as HTTPServer } from 'https';
import { Server } from 'socket.io';

class IOServer extends Server {
  constructor({ env, port }: { env: string; port: number }) {
    let server: HTTPServer | number;

    if (env === 'e2e') {
      server = createServer({
        key: readFileSync('certs/localhost.key'),
        cert: readFileSync('certs/localhost.crt'),
      });
      server.listen(port);
    } else {
      server = port;
    }

    super(server, {
      allowEIO3: true,
      transports: ['websocket'],
      pingTimeout: 10000,
      pingInterval: 5000,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  start() {}

  stop(): void {
    this.close();
  }
}

export default IOServer;
