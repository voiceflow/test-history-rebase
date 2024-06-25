import type { Logger } from '@voiceflow/logger';
import type { HashedIDService } from '@voiceflow/nestjs-common';
import type { IdentityClient } from '@voiceflow/sdk-identity';
import type { BaseServiceMap } from '@voiceflow/socket-utils';

import type { AssistantService } from '@/assistant/assistant.service';
import type { CreatorService } from '@/creator/creator.service';
import type { FlowService } from '@/flow/flow.service';
import type { OrganizationIdentityService } from '@/organization/identity/identity.service';
import type { ProjectService as ProjectServiceV2 } from '@/project/project.service';
import type { ProjectListService } from '@/project-list/project-list.service';
import type { ReferenceService } from '@/reference/reference.service';
import type { ThreadService } from '@/thread/thread.service';
import type { Config } from '@/types';
import type { UserService } from '@/user/user.service';
import type { WorkflowService } from '@/workflow/workflow.service';

import type { ClientMap } from '../clients';
import type { ModelMap } from '../models';
import BillingService from './billing';
import CanvasTemplateService from './canvasTemplate';
import CustomBlockService from './customBlock';
import DiagramService from './diagram';
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
  flow: FlowService;
  thread: ThreadService;
  viewer: ViewerService;
  billing: BillingService;
  diagram: DiagramService;
  project: ProjectService;
  version: VersionService;
  migrate: MigrateService;
  feature: FeatureService;
  workflow: WorkflowService;
  identity: IdentityClient;
  variable: VariableService;
  hashedID: HashedIDService;
  projectV2: ProjectServiceV2;
  voiceflow: VoiceflowService;
  workspace: WorkspaceService;
  assistant: AssistantService;
  reference: ReferenceService;
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
    flow: FlowService;
    thread: ThreadService;
    creator: CreatorService;
    project: ProjectServiceV2;
    identity: IdentityClient;
    workflow: WorkflowService;
    hashedID: HashedIDService;
    assistant: AssistantService;
    reference: ReferenceService;
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
    flow: injectedServices.flow,
    thread: injectedServices.thread,
    viewer: new ViewerService(serviceOptions),
    billing: new BillingService(serviceOptions),
    diagram: new DiagramService(serviceOptions),
    project: new ProjectService(serviceOptions),
    version: new VersionService(serviceOptions),
    migrate: new MigrateService(serviceOptions),
    feature: new FeatureService(serviceOptions),
    identity: injectedServices.identity,
    variable: new VariableService(serviceOptions),
    hashedID: injectedServices.hashedID,
    workflow: injectedServices.workflow,
    projectV2: injectedServices.project,
    reference: injectedServices.reference,
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
