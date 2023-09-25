import { ServerMeta } from '@logux/server';
import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { LoguxServer } from '@voiceflow/nestjs-logux';
import { SocketServer } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { createLogger } from '@/logger';
import { ProjectListService } from '@/project-list/project-list.service';
import { Config } from '@/types';
import { UserService } from '@/user/user.service';

import { IOServer } from './ioServer';
import ServiceManager from './serviceManager';

@Injectable()
export class LegacyService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly serviceManager: ServiceManager;

  constructor(
    @Inject(LoguxServer) server: LoguxServer,
    @Inject(IOServer) ioServer: IOServer,
    @Inject(ENVIRONMENT_VARIABLES) config: Config,
    @Inject(UserService) user: UserService,
    @Inject(ProjectListService) projectList: ProjectListService
  ) {
    this.serviceManager = new ServiceManager({
      server: Object.assign(server, {
        processAs: (creatorID: number, clientID: string, action: Action<any>, meta?: Partial<ServerMeta>) =>
          server.process({ ...action, meta: { ...action?.meta, creatorID, clientID } }, meta),
      }) as unknown as SocketServer,
      ioServer,
      injectedServices: {
        user,
        projectList,
      },
      config,
      log: createLogger(config.NODE_ENV, config.LOG_LEVEL),
    });
  }

  async onApplicationBootstrap() {
    await this.serviceManager.start();
  }

  async onApplicationShutdown() {
    await this.serviceManager.stop();
  }

  get models() {
    return this.serviceManager.models;
  }

  get services() {
    return this.serviceManager.services;
  }
}
