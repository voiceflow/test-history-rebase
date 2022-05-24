import { readFileSync } from 'fs';
import { createServer } from 'https';
import { Server } from 'socket.io';

class IOServer extends Server {
  private env: string;

  private port: number;

  constructor({ env, port }: { env: string; port: number }) {
    super({
      allowEIO3: true,
      transports: ['websocket'],
      pingTimeout: 10000,
      pingInterval: 5000,
    });

    this.env = env;
    this.port = port;
  }

  start(): void {
    if (this.env === 'e2e') {
      const server = createServer({
        key: readFileSync('certs/localhost.key'),
        cert: readFileSync('certs/localhost.crt'),
      });

      this.listen(server);
      server.listen(this.port);
    } else {
      this.listen(this.port);
    }
  }

  stop(): void {
    this.close();
  }
}

export default IOServer;
