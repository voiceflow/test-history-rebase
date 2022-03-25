import { BaseServiceMap, SyncService } from '@voiceflow/socket-utils';

import type { ClientMap } from '../clients';
import type { Config } from '../types';
import DiagramService from './diagram';
import IntentService from './intent';
import NoteService from './note';
import ProductService from './product';
import ProjectService from './project';
import ProjectListService from './projectList';
import SlotService from './slot';
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
  viewer: ViewerService;
  intent: IntentService;
  product: ProductService;
  diagram: DiagramService;
  project: ProjectService;
  version: VersionService;
  voiceflow: VoiceflowService;
  workspace: WorkspaceService;
  projectList: ProjectListService;
  variableState: VariableService;
}

interface Options {
  config: Config;
  clients: ClientMap;
}

const buildServices = ({ config, clients }: Options): ServiceMap => {
  const services = {} as ServiceMap;
  const serviceOptions = { config, clients, services };

  const serviceMap: ServiceMap = {
    slot: new SlotService(serviceOptions),
    user: new UserService(serviceOptions),
    sync: new SyncService(serviceOptions),
    note: new NoteService(serviceOptions),
    viewer: new ViewerService(serviceOptions),
    intent: new IntentService(serviceOptions),
    diagram: new DiagramService(serviceOptions),
    product: new ProductService(serviceOptions),
    project: new ProjectService(serviceOptions),
    version: new VersionService(serviceOptions),
    voiceflow: new VoiceflowService(serviceOptions),
    workspace: new WorkspaceService(serviceOptions),
    projectList: new ProjectListService(serviceOptions),
    variableState: new VariableService(serviceOptions),
  };

  Object.assign(services, serviceMap);

  return services;
};

export default buildServices;
