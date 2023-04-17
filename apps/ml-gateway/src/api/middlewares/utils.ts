import { Config } from '@/types';

import type { ClientMap } from '../../clients';
import type { ServiceMap } from '../../services';

export interface MiddlewareDependencies {
  services: ServiceMap;
  clients: ClientMap;
}

export abstract class AbstractMiddleware {
  public services: ServiceMap;

  public clients: ClientMap;

  constructor(public config: Config, { services, clients }: MiddlewareDependencies) {
    this.services = services;
    this.clients = clients;
  }
}
