import { BaseServiceMap, SyncService } from '@voiceflow/socket-utils';

import type { ClientMap } from '../clients';
import type { ModelMap } from '../models';
import type { Config } from '../types';
import CanvasTemplateService from './canvasTemplate';
import DiagramService from './diagram';
import DomainService from './domain';
import IntentService from './intent';
import LockService from './lock';
import MigrateService from './migrate';
import NoteService from './note';
import ProductService from './product';
import ProjectService from './project';
import ProjectListService from './projectList';
import SlotService from './slot';
import ThreadService from './thread';
import UserService from './user';
import VariableService from './variableState';
import VersionService from './version';
import ViewerService from './viewer';
import VoiceflowService from './voiceflow';
import WorkspaceService from './workspace';

export interface ServiceMap extends BaseServiceMap {
  user: UserService;
  slot: SlotService;
  note: NoteService;
  lock: LockService;
  thread: ThreadService;
  domain: DomainService;
  viewer: ViewerService;
  intent: IntentService;
  product: ProductService;
  diagram: DiagramService;
  project: ProjectService;
  version: VersionService;
  migrate: MigrateService;
  voiceflow: VoiceflowService;
  workspace: WorkspaceService;
  projectList: ProjectListService;
  variableState: VariableService;
  canvasTemplate: CanvasTemplateService;
}

interface Options {
  config: Config;
  clients: ClientMap;
  models: ModelMap;
}

const buildServices = ({ config, clients, models }: Options): ServiceMap => {
  const services = {} as ServiceMap;
  const serviceOptions = { config, clients, services, models };

  const serviceMap: ServiceMap = {
    slot: new SlotService(serviceOptions),
    user: new UserService(serviceOptions),
    sync: new SyncService(serviceOptions),
    note: new NoteService(serviceOptions),
    lock: new LockService(serviceOptions),
    thread: new ThreadService(serviceOptions),
    viewer: new ViewerService(serviceOptions),
    intent: new IntentService(serviceOptions),
    domain: new DomainService(serviceOptions),
    diagram: new DiagramService(serviceOptions),
    product: new ProductService(serviceOptions),
    project: new ProjectService(serviceOptions),
    version: new VersionService(serviceOptions),
    migrate: new MigrateService(serviceOptions),
    voiceflow: new VoiceflowService(serviceOptions),
    workspace: new WorkspaceService(serviceOptions),
    projectList: new ProjectListService(serviceOptions),
    variableState: new VariableService(serviceOptions),
    canvasTemplate: new CanvasTemplateService(serviceOptions),
  };

  Object.assign(services, serviceMap);

  return services;
};

export default buildServices;
