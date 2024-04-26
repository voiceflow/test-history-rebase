/* eslint-disable max-params */
import { ServerMeta } from '@logux/server';
import { EntityManager, RequestContext } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { HashedIDService } from '@voiceflow/nestjs-common';
import { ENVIRONMENT_VARIABLES } from '@voiceflow/nestjs-env';
import { LoguxServer } from '@voiceflow/nestjs-logux';
import { DatabaseTarget } from '@voiceflow/orm-designer';
import { IdentityClient } from '@voiceflow/sdk-identity';
import { SocketServer } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AssistantService } from '@/assistant/assistant.service';
import { CreatorService } from '@/creator/creator.service';
import { FlowService } from '@/flow/flow.service';
import { createLogger } from '@/logger';
import { OrganizationIdentityService } from '@/organization/identity/identity.service';
import { ProjectService } from '@/project/project.service';
import { ProjectListService } from '@/project-list/project-list.service';
import { ThreadService } from '@/thread/thread.service';
import { Config } from '@/types';
import { UserService } from '@/user/user.service';
import { WorkflowService } from '@/workflow/workflow.service';

import { IOServer } from './ioServer';
import ServiceManager from './serviceManager';

@Injectable()
export class LegacyService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly serviceManager: ServiceManager;

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.MONGO))
    private readonly mongoEM: EntityManager,
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    private readonly postgresEM: EntityManager,
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
    @Inject(ProjectService)
    private readonly project: ProjectService,
    @Inject(IdentityClient)
    private readonly identityClient: IdentityClient,
    @Inject(CreatorService)
    private readonly creator: CreatorService,
    @Inject(ThreadService)
    private readonly thread: ThreadService,
    @Inject(FlowService)
    private readonly flow: FlowService,
    @Inject(WorkflowService)
    private readonly workflow: WorkflowService,
    @Inject(HashedIDService)
    private readonly hashedID: HashedIDService,
    @Inject(OrganizationIdentityService)
    private readonly organization: OrganizationIdentityService
  ) {
    this.serviceManager = new ServiceManager({
      server: Object.assign(this.server, {
        processAs: (creatorID: number, clientID: string, action: Action<any>, meta?: Partial<ServerMeta>) =>
          this.server.process({ ...action, meta: { ...action?.meta, creatorID, clientID } }, meta),
      }) as unknown as SocketServer,
      ioServer: this.ioServer,
      injectedServices: {
        user: this.user,
        identity: this.identityClient,
        hashedID: this.hashedID,
        assistant: this.assistant,
        project: this.project,
        projectList: this.projectList,
        creator: this.creator,
        thread: this.thread,
        flow: this.flow,
        workflow: this.workflow,
        organization: this.organization,
        requestContext: {
          createAsync: <T>(callback: () => Promise<T>): Promise<T> =>
            RequestContext.createAsync([this.mongoEM, this.postgresEM], callback),
        },
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

  get models() {
    return this.serviceManager.models;
  }

  get services() {
    return this.serviceManager.services;
  }
}
