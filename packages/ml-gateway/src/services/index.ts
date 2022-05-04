import { BaseServiceMap, SyncService } from '@voiceflow/socket-utils';

import type { ClientMap } from '../clients';
import type { Config } from '../types';

export type ServiceMap = BaseServiceMap;

interface Options {
  config: Config;
  clients: ClientMap;
}

const buildServices = ({ config, clients }: Options): ServiceMap => {
  const services = {} as ServiceMap;
  const serviceOptions = { config, clients, services };

  const serviceMap: ServiceMap = {
    sync: new SyncService(serviceOptions),
  };

  Object.assign(services, serviceMap);

  return services;
};

export default buildServices;
