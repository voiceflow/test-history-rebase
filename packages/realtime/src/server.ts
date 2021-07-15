import * as Logux from '@logux/server';
import { Authorizer, Processor, Resender } from '@logux/server/base-server';
import Logger from '@voiceflow/logger';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action, ActionCreator, AnyAction } from 'typescript-fsa';

import createClient from './client';
import type { Config, Plugin } from './types';
import { createDiagramAuthorizer, createProjectAuthorizer, createVersionAuthorizer, createWorkspaceAuthorizer } from './utils';

const SUBPROTOCOL = '1.0.0';
const SUPPORT_RANGE = '1.x';

type ActionCreatorPayload<T extends ActionCreator<any>> = T extends ActionCreator<infer R> ? R : never;

class Server extends Logux.Server {
  client = createClient(this.config);

  workspaceAuthorizer = createWorkspaceAuthorizer();

  projectAuthorizer = createProjectAuthorizer();

  versionAuthorizer = createVersionAuthorizer();

  diagramAuthorizer = createDiagramAuthorizer();

  constructor(cwd: string, log: Logger, public config: Config) {
    super({
      subprotocol: SUBPROTOCOL,
      supports: SUPPORT_RANGE,
      root: cwd,
      port: config.PORT,
      logger: {
        info: (details: { action: AnyAction }, message) => {
          // ignore MOVE_CURSOR actions and processed responses
          if ([Realtime.diagram.moveCursor.type, 'logux/processed'].includes(details?.action?.type)) return;
          // ignore action processing logs
          if (['Action was processed', 'Action was cleaned'].includes(message)) return;

          log.info({ message, details: config.NODE_ENV === 'production' || !details.action ? details : details.action });
        },
        warn: (details, message) => log.warn({ message, details }),
        error: (details, message) => log.error({ message, details }),
        fatal: (details, message) => log.fatal({ message, details }),
      },
      env: config.NODE_ENV === 'production' ? 'production' : 'development',

      ...(config.NODE_ENV === 'e2e' && {
        cert: 'certs/localhost.crt',
        key: 'certs/localhost.key',
      }),
    });
  }

  use(...plugins: Plugin[]) {
    return plugins.map((plugin) => plugin(this));
  }

  action<T extends ActionCreator<any>>(
    actionCreator: T,
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      access: Authorizer<Action<ActionCreatorPayload<T>>, {}, {}>;
      // eslint-disable-next-line @typescript-eslint/ban-types
      process: Processor<Action<ActionCreatorPayload<T>>, {}, {}>;
      // eslint-disable-next-line @typescript-eslint/ban-types
      resend?: Resender<Action<ActionCreatorPayload<T>>, {}, {}>;
    }
  ): void {
    this.type<Action<ActionCreatorPayload<T>>>(actionCreator.type, callbacks);
  }

  noop<T extends ActionCreator<any>>(
    actionCreator: T,
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      access?: Authorizer<Action<ActionCreatorPayload<T>>, {}, {}>;
      // eslint-disable-next-line @typescript-eslint/ban-types
      process?: Processor<Action<ActionCreatorPayload<T>>, {}, {}>;
      // eslint-disable-next-line @typescript-eslint/ban-types
      resend?: Resender<Action<ActionCreatorPayload<T>>, {}, {}>;
    } = {}
  ): void {
    this.type<Action<ActionCreatorPayload<T>>>(actionCreator.type, {
      access: () => true,
      process: () => {
        // noop
      },
      ...callbacks,
    });
  }

  start() {
    return this.listen();
  }

  stop() {
    return this.destroy();
  }
}

export default Server;
