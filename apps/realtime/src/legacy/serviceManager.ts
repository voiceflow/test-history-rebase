import type { HashedIDService } from '@voiceflow/nestjs-common';
import type { IdentityClient } from '@voiceflow/sdk-identity';
import type { ServiceManagerOptions, SocketServer } from '@voiceflow/socket-utils';

import type { AssistantService } from '@/assistant/assistant.service';
import type { CreatorService } from '@/creator/creator.service';
import type { FlowService } from '@/flow/flow.service';
import type { OrganizationIdentityService } from '@/organization/identity/identity.service';
import type { ProjectService } from '@/project/project.service';
import type { ProjectListService } from '@/project-list/project-list.service';
import type { ThreadService } from '@/thread/thread.service';
import type { UserService } from '@/user/user.service';
import type { WorkflowService } from '@/workflow/workflow.service';

import buildActions from './actions';
import buildChannels from './channels';
import buildClients, { stopClients } from './clients';
import type { IOControlOptions, LoguxControlOptions } from './control';
import buildIO from './io';
import buildModels from './models';
import buildServices from './services';

interface Options extends ServiceManagerOptions<LoguxControlOptions['config']> {
  ioServer: IOControlOptions['ioServer'];
  injectedServices: {
    user: UserService;
    flow: FlowService;
    thread: ThreadService;
    creator: CreatorService;
    project: ProjectService;
    identity: IdentityClient;
    workflow: WorkflowService;
    hashedID: HashedIDService;
    assistant: AssistantService;
    projectList: ProjectListService;
    organization: OrganizationIdentityService;
    requestContext: {
      createAsync: <T>(callback: () => Promise<T>) => Promise<T>;
    };
  };
}

class ServiceManager {
  public actions: LoguxControlOptions['actions'];

  public models!: LoguxControlOptions['models'];

  public clients!: LoguxControlOptions['clients'];

  public services!: LoguxControlOptions['services'];

  public channels: LoguxControlOptions['channels'];

  protected log: IOControlOptions['log'];

  protected config: IOControlOptions['config'];

  protected server: SocketServer;

  protected ioServer: IOControlOptions['ioServer'];

  constructor({ log, server, config, ioServer, injectedServices }: Options) {
    const clients = buildClients({ config, log });
    const models = buildModels({ config, clients });
    const services = buildServices({ config, clients, models, log, injectedServices });
    const actions = {} as LoguxControlOptions['actions'];
    const channels = {} as LoguxControlOptions['channels'];

    Object.assign(
      actions,
      buildActions({ server, config, services, clients, actions, channels, log } as LoguxControlOptions)
    );
    Object.assign(
      channels,
      buildChannels({ server, config, services, clients, actions, channels, log } as LoguxControlOptions)
    );

    this.log = log;
    this.config = config;
    this.models = models;
    this.server = server;
    this.actions = actions;
    this.clients = clients;
    this.channels = channels;
    this.services = services;
    this.ioServer = ioServer;
  }

  /**
   * Start services
   */
  async start(): Promise<void> {
    await Promise.all(Object.values(this.clients).map((client) => client.setup?.()));
    await Promise.all(Object.values(this.models).map((model) => model.setup()));
    await Promise.all(Object.values(this.channels).map((channel) => channel.setup()));
    await Promise.all(Object.values(this.actions).map((action) => action.setup()));

    buildIO({
      log: this.log,
      models: this.models,
      config: this.config,
      clients: this.clients,
      ioServer: this.ioServer,
      services: this.services,
    });
  }

  /**
   * Stop services
   */
  async stop(): Promise<void> {
    await Promise.allSettled(Object.values(this.clients).map((client) => client.destroy?.()));
    await Promise.allSettled(Object.values(this.models).map((model) => model.destroy()));
    await Promise.allSettled(Object.values(this.actions).map((action) => action.destroy()));
    await Promise.allSettled(Object.values(this.channels).map((channel) => channel.destroy()));

    await stopClients(this.clients);
  }
}

export default ServiceManager;
