import { Logger } from '@voiceflow/logger';
import { HashedIDService } from '@voiceflow/nestjs-common';
import type { IdentityClient } from '@voiceflow/sdk-identity';
import { BaseServiceMap } from '@voiceflow/socket-utils';

import { AssistantService } from '@/assistant/assistant.service';
import { CreatorService } from '@/creator/creator.service';
import { OrganizationIdentityService } from '@/organization/identity/identity.service';
import type { ProjectService as ProjectServiceV2 } from '@/project/project.service';
import { ProjectListService } from '@/project-list/project-list.service';
import { ThreadService } from '@/thread/thread.service';
import type { Config } from '@/types';
import type { UserService } from '@/user/user.service';

import type { ClientMap } from '../clients';
import type { ModelMap } from '../models';
import BillingService from './billing';
import CanvasTemplateService from './canvasTemplate';
import CustomBlockService from './customBlock';
import DiagramService from './diagram';
import DomainService from './domain';
import FeatureService from './feature';
import LockService from './lock';
import MigrateService from './migrate';
import ProjectService from './project';
import VariableService from './variable';
import VariableStateService from './variableState';
import VersionService from './version';
import ViewerService from './viewer';
import VoiceflowService from './voiceflow';
import WorkspaceService, { WorkspaceSettingsService } from './workspace';

export interface ServiceMap extends BaseServiceMap {
  lock: LockService;
  user: UserService;
  thread: ThreadService;
  domain: DomainService;
  viewer: ViewerService;
  billing: BillingService;
  diagram: DiagramService;
  project: ProjectService;
  version: VersionService;
  migrate: MigrateService;
  feature: FeatureService;
  identity: IdentityClient;
  variable: VariableService;
  hashedID: HashedIDService;
  projectV2: ProjectServiceV2;
  voiceflow: VoiceflowService;
  workspace: WorkspaceService;
  assistant: AssistantService;
  customBlock: CustomBlockService;
  projectList: ProjectListService;
  organization: OrganizationIdentityService;
  variableState: VariableStateService;
  canvasTemplate: CanvasTemplateService;
  workspaceSettings: WorkspaceSettingsService;
  creator: CreatorService;
  requestContext: {
    createAsync: <T>(callback: () => Promise<T>) => Promise<T>;
  };
}

interface Options {
  config: Config;
  models: ModelMap;
  clients: ClientMap;
  log: Logger;
  injectedServices: {
    user: UserService;
    thread: ThreadService;
    creator: CreatorService;
    project: ProjectServiceV2;
    identity: IdentityClient;
    hashedID: HashedIDService;
    assistant: AssistantService;
    projectList: ProjectListService;
    organization: OrganizationIdentityService;
    requestContext: {
      createAsync: <T>(callback: () => Promise<T>) => Promise<T>;
    };
  };
}

const buildServices = ({ config, clients, models, log, injectedServices }: Options): ServiceMap => {
  const services = {} as ServiceMap;
  const serviceOptions = { config, clients, services, models, log };

  const serviceMap: ServiceMap = {
    sync: {} as any, // TODO: need to remove off service map
    lock: new LockService(serviceOptions),
    user: injectedServices.user,
    thread: injectedServices.thread,
    viewer: new ViewerService(serviceOptions),
    domain: new DomainService(serviceOptions),
    billing: new BillingService(serviceOptions),
    diagram: new DiagramService(serviceOptions),
    project: new ProjectService(serviceOptions),
    version: new VersionService(serviceOptions),
    migrate: new MigrateService(serviceOptions),
    feature: new FeatureService(serviceOptions),
    identity: injectedServices.identity,
    variable: new VariableService(serviceOptions),
    hashedID: injectedServices.hashedID,
    projectV2: injectedServices.project,
    assistant: injectedServices.assistant,
    voiceflow: new VoiceflowService(serviceOptions),
    workspace: new WorkspaceService(serviceOptions),
    customBlock: new CustomBlockService(serviceOptions),
    projectList: injectedServices.projectList,
    organization: injectedServices.organization,
    variableState: new VariableStateService(serviceOptions),
    requestContext: injectedServices.requestContext,
    canvasTemplate: new CanvasTemplateService(serviceOptions),
    workspaceSettings: new WorkspaceSettingsService(serviceOptions),
    creator: injectedServices.creator,
  };

  Object.assign(services, serviceMap);

  return services;
};

export default buildServices;
