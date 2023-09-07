import { ServerMeta } from '@logux/server';
import { LoguxServer } from '@voiceflow/nestjs-logux';
import { SocketServer } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import IOServer from '@/ioServer';
import { createLogger } from '@/logger';
import ServiceManager from '@/serviceManager';
import { Config } from '@/types';

export class LegacyService {
  private readonly serviceManager: ServiceManager;

  constructor(server: LoguxServer, ioServer: IOServer, config: Config) {
    this.serviceManager = new ServiceManager({
      server: Object.assign(server, {
        processAs: (creatorID: number, action: Action<any>, meta?: Partial<ServerMeta>) =>
          server.process({ ...action, meta: { ...action?.meta, creatorID } }, meta),
      }) as unknown as SocketServer,
      ioServer,
      config,
      log: createLogger(config.NODE_ENV, config.LOG_LEVEL),
    });
  }

  async init(): Promise<this> {
    // await this.serviceManager.start();

    return this;
  }
}
