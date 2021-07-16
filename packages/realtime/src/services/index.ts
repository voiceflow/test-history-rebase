import type { ClientMap } from '../clients';
import type { Config } from '../types';
import DiagramService from './diagram';
import ProjectService from './project';
import UserService from './user';
import VersionService from './version';
import ViewerService from './viewer';
import WorkspaceService from './workspace';

export type ServiceMap = {
  user: UserService;
  viewer: ViewerService;
  diagram: DiagramService;
  project: ProjectService;
  version: VersionService;
  workspace: WorkspaceService;
};

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
    project: new ProjectService(serviceOptions),
    version: new VersionService(serviceOptions),
    workspace: new WorkspaceService(serviceOptions),
  };

  Object.assign(services, serviceMap);

  return services;
};

export default buildServices;
