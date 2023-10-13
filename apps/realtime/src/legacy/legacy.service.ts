/* eslint-disable max-params */
import { ServerMeta } from '@logux/server';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { LoguxServer } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { SocketServer } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AssistantService } from '@/assistant/assistant.service';
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
    @Inject(LoguxServer)
    private readonly server: LoguxServer,
    @Inject(IOServer)
    private readonly ioServer: IOServer,
    @Inject(ENVIRONMENT_VARIABLES)
    private readonly config: Config,
    @Inject(UserService)
    private readonly user: UserService,
    @Inject(AssistantService)
    private readonly assistant: AssistantService,
    @Inject(ProjectListService)
    private readonly projectList: ProjectListService,
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly em: EntityManager
  ) {
    this.serviceManager = new ServiceManager({
      server: Object.assign(this.server, {
        processAs: (creatorID: number, clientID: string, action: Action<any>, meta?: Partial<ServerMeta>) =>
          this.server.process({ ...action, meta: { ...action?.meta, creatorID, clientID } }, meta),
      }) as unknown as SocketServer,
      ioServer: this.ioServer,
      injectedServices: {
        user: this.user,
        hashedID: this.hashedID,
        assistant: this.assistant,
        projectList: this.projectList,
        entityManager: this.em,
      },
      config: this.config,
      log: createLogger(config.NODE_ENV, config.LOG_LEVEL),
    });
  }

  async onApplicationBootstrap() {
    await this.serviceManager.start();
  }

  async onApplicationShutdown() {
    await this.serviceManager.stop();
  }
}
