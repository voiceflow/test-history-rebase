import * as Logux from '@logux/server';
import Logger from '@voiceflow/logger';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AnyAction } from 'typescript-fsa';

import type { Config } from './types';

const SUBPROTOCOL = '1.0.0';
const SUPPORT_RANGE = '1.x';

interface Options {
  cwd: string;
  config: Config;
  logger: Logger;
}

class Server extends Logux.Server {
  constructor({ cwd, config, logger }: Options) {
    super({
      subprotocol: SUBPROTOCOL,
      supports: SUPPORT_RANGE,
      root: cwd,
      host: '0.0.0.0',
      port: config.PORT,
      logger: {
        info: (details: { action: AnyAction }, message) => {
          // ignore MOVE_CURSOR actions and processed responses
          if ([Realtime.diagram.moveCursor.type, 'logux/processed'].includes(details?.action?.type)) return;
          // ignore action processing logs
          if (['Action was processed', 'Action was cleaned'].includes(message)) return;

          logger.info({ message, details: config.NODE_ENV === 'production' || !details.action ? details : details.action });
        },
        warn: (details, message) => logger.warn({ message, details }),
        error: (details, message) => logger.error({ message, details }),
        fatal: (details, message) => logger.fatal({ message, details }),
      },
      env: config.NODE_ENV === 'production' ? 'production' : 'development',

      ...((config.NODE_ENV === 'e2e' || config.NODE_ENV === 'local') && {
        cert: 'certs/localhost.crt',
        key: 'certs/localhost.key',
      }),
    });
  }

  async start(): Promise<void> {
    await this.listen();
  }

  async stop(): Promise<void> {
    await this.destroy();
  }
}

export default Server;
