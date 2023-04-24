import * as Logux from '@logux/server';
import { Environment } from '@voiceflow/common';
import { Logger } from '@voiceflow/logger';
import { Action, AnyAction } from 'typescript-fsa';

const SUBPROTOCOL = '1.0.0';
const SUPPORT_RANGE = '1.x';
const WARNING_BYPASS = new Set(['Zombie client was disconnected', 'Action was denied', 'WS was closed']);
// Ignore action processing logs
const INFO_BYPASS = new Set(['Action was processed', 'Action was cleaned']);

export interface SocketServerOptions {
  cwd: string;
  env: string;
  port: number;
  logger: Logger;
  timeout?: number;
  supports?: string;
  subprotocol?: string;
  loggerIgnoredActions?: string[];
}

export class SocketServer extends Logux.Server {
  constructor({ port, cwd, env, logger, timeout, supports = SUPPORT_RANGE, subprotocol = SUBPROTOCOL, loggerIgnoredActions }: SocketServerOptions) {
    super({
      root: cwd,
      host: '0.0.0.0',
      port,
      timeout,
      supports,
      subprotocol,
      logger: {
        info: (details: { action: AnyAction }, message) => {
          const actionType = details?.action?.type || '';

          if ([...(loggerIgnoredActions ?? []), 'logux/processed'].includes(details?.action?.type)) return;
          if (INFO_BYPASS.has(message)) return;

          logger.info(env === Environment.PRODUCTION ? { message, details } : `${message}${actionType && ': '}${actionType}`);
        },
        warn: (details, message) => {
          if (WARNING_BYPASS.has(message)) return;

          logger.warn({ message, details });
        },
        error: (details, message) => logger.error({ message, details }),
        fatal: (details, message) => logger.fatal({ message, details }),
      },
      env: env === Environment.PRODUCTION ? Environment.PRODUCTION : Environment.DEVELOPMENT,

      ...(env === Environment.E2E && {
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

  public async processAs(creatorID: number, action: Action<any>, meta?: Partial<Logux.ServerMeta>): Promise<Readonly<Logux.ServerMeta>> {
    return this.process({ ...action, meta: { ...action?.meta, creatorID } }, meta);
  }

  protected denyAction(action: AnyAction, meta: Logux.ServerMeta): void {
    this.logger.warn({ message: 'Action was denied', action, meta });
    super.denyAction(action, meta);
  }
}
