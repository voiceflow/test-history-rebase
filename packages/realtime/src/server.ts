import * as Logux from '@logux/server';
import Logger from '@voiceflow/logger';

import type { Config, Plugin } from './types';

const SUBPROTOCOL = '1.0.0';
const SUPPORT_RANGE = '1.x';

class Server extends Logux.Server {
  constructor(cwd: string, log: Logger, config: Config) {
    super({
      subprotocol: SUBPROTOCOL,
      supports: SUPPORT_RANGE,
      root: cwd,
      port: config.PORT,
      logger: log,
    });
  }

  use(...plugins: Plugin[]) {
    return plugins.map((plugin) => plugin(this));
  }

  start() {
    return this.listen();
  }

  stop() {
    this.stop();
  }
}

export default Server;
