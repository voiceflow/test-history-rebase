import type { ClientMap } from '../clients';
import type { Config } from '../types';
import DiagramService from './diagram';
import IntentService from './intent';
import ProductService from './product';
import ProjectService from './project';
import ProjectListService from './projectList';
import SlotService from './slot';
import SyncService from './sync';
import UserService from './user';
import VersionService from './version';
import ViewerService from './viewer';
import VoiceflowService from './voiceflow';
import WorkspaceService from './workspace';

export interface ServiceMap {
  user: UserService;
  viewer: ViewerService;
  diagram: DiagramService;
  intent: IntentService;
  product: ProductService;
  project: ProjectService;
  slot: SlotService;
  version: VersionService;
  voiceflow: VoiceflowService;
  workspace: WorkspaceService;
  projectList: ProjectListService;
  sync: SyncService;
}

interface Options {
  config: Config;
  clients: ClientMap;
}

const buildServices = ({ config, clients }: Options): ServiceMap => {
  const services = {} as ServiceMap;
  const serviceOptions = { config, clients, services };

  const serviceMap: ServiceMap = {
    user: new UserService(serviceOptions),
    viewer: new ViewerService(serviceOptions),
    diagram: new DiagramService(serviceOptions),
    intent: new IntentService(serviceOptions),
    product: new ProductService(serviceOptions),
    project: new ProjectService(serviceOptions),
    slot: new SlotService(serviceOptions),
    version: new VersionService(serviceOptions),
    voiceflow: new VoiceflowService(serviceOptions),
    workspace: new WorkspaceService(serviceOptions),
    projectList: new ProjectListService(serviceOptions),
    sync: new SyncService(serviceOptions),
  };

  Object.assign(services, serviceMap);

  return services;
};

export default buildServices;
