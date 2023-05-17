import { BaseServiceMap, SyncService } from '@voiceflow/socket-utils';

import type { ClientMap } from '../clients';
import type { ModelMap } from '../models';
import type { Config } from '../types';
import BillingService from './billing';
import CanvasTemplateService from './canvasTemplate';
import CustomBlockService from './customBlock';
import DiagramService from './diagram';
import DomainService from './domain';
import FeatureService from './feature';
import IntentService from './intent';
import LockService from './lock';
import MigrateService from './migrate';
import NluService from './nlu';
import NoteService from './note';
import OrganizationService from './organization';
import ProductService from './product';
import ProjectService from './project';
import ProjectListService from './projectList';
import SlotService from './slot';
import ThreadService from './thread';
import UserService from './user';
import VariableService from './variable';
import VariableStateService from './variableState';
import VersionService from './version';
import ViewerService from './viewer';
import VoiceflowService from './voiceflow';
import WorkspaceService, { WorkspaceSettingsService } from './workspace';

export interface ServiceMap extends BaseServiceMap {
  nlu: NluService;
  user: UserService;
  slot: SlotService;
  note: NoteService;
  lock: LockService;
  thread: ThreadService;
  domain: DomainService;
  viewer: ViewerService;
  intent: IntentService;
  billing: BillingService;
  product: ProductService;
  diagram: DiagramService;
  project: ProjectService;
  version: VersionService;
  migrate: MigrateService;
  feature: FeatureService;
  variable: VariableService;
  voiceflow: VoiceflowService;
  workspace: WorkspaceService;
  customBlock: CustomBlockService;
  projectList: ProjectListService;
  organization: OrganizationService;
  variableState: VariableStateService;
  canvasTemplate: CanvasTemplateService;
  workspaceSettings: WorkspaceSettingsService;
}

interface Options {
  config: Config;
  models: ModelMap;
  clients: ClientMap;
}

const buildServices = ({ config, clients, models }: Options): ServiceMap => {
  const services = {} as ServiceMap;
  const serviceOptions = { config, clients, services, models };

  const serviceMap: ServiceMap = {
    nlu: new NluService(serviceOptions),
    slot: new SlotService(serviceOptions),
    user: new UserService(serviceOptions),
    sync: new SyncService(serviceOptions),
    note: new NoteService(serviceOptions),
    lock: new LockService(serviceOptions),
    thread: new ThreadService(serviceOptions),
    viewer: new ViewerService(serviceOptions),
    intent: new IntentService(serviceOptions),
    domain: new DomainService(serviceOptions),
    billing: new BillingService(serviceOptions),
    diagram: new DiagramService(serviceOptions),
    product: new ProductService(serviceOptions),
    project: new ProjectService(serviceOptions),
    version: new VersionService(serviceOptions),
    migrate: new MigrateService(serviceOptions),
    feature: new FeatureService(serviceOptions),
    variable: new VariableService(serviceOptions),
    voiceflow: new VoiceflowService(serviceOptions),
    workspace: new WorkspaceService(serviceOptions),
    customBlock: new CustomBlockService(serviceOptions),
    projectList: new ProjectListService(serviceOptions),
    organization: new OrganizationService(serviceOptions),
    variableState: new VariableStateService(serviceOptions),
    canvasTemplate: new CanvasTemplateService(serviceOptions),
    workspaceSettings: new WorkspaceSettingsService(serviceOptions),
  };

  Object.assign(services, serviceMap);

  return services;
};

export default buildServices;
