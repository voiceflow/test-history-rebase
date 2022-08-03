import './syncMessage.js';

import * as Logux from '@logux/server';
import { ServerMeta } from '@logux/server';
import Logger from '@voiceflow/logger';
import { Action, AnyAction } from 'typescript-fsa';

const SUBPROTOCOL = '1.0.0';
const SUPPORT_RANGE = '1.x';

export interface SocketServerOptions {
  port: number;
  cwd: string;
  env: string;
  logger: Logger;
  loggerIgnoredActions?: string[];
}

export class SocketServer extends Logux.Server {
  constructor({ port, cwd, env, logger, loggerIgnoredActions }: SocketServerOptions) {
    super({
      subprotocol: SUBPROTOCOL,
      supports: SUPPORT_RANGE,
      root: cwd,
      host: '0.0.0.0',
      port,
      logger: {
        info: (details: { action: AnyAction }, message) => {
          // ignore MOVE_CURSOR actions and processed responses
          if ([...(loggerIgnoredActions ?? []), 'logux/processed'].includes(details?.action?.type)) return;
          // ignore action processing logs
          if (['Action was processed', 'Action was cleaned'].includes(message)) return;

          logger.info({ message, details: env === 'production' || !details.action ? details : details.action });
        },
        warn: (details, message) => logger.warn({ message, details }),
        error: (details, message) => logger.error({ message, details }),
        fatal: (details, message) => logger.fatal({ message, details }),
      },
      env: env === 'production' ? 'production' : 'development',

      ...(env === 'e2e' && {
        cert: 'certs/localhost.crt',
        key: 'certs/localhost.key',
      }),
    });
  }

  async start(): Promise<void> {
    await this.listen();
  }

  async stop(): Promise<void> {
    await Promise.allSettled([this.destroy()]);
  }

  public async processAs(creatorID: number, action: Action<any>, meta?: Partial<ServerMeta>): Promise<Readonly<ServerMeta>> {
    return this.process({ ...action, meta: { ...action?.meta, creatorID } }, meta);
  }
}
