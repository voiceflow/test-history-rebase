import { Config } from '@/types';

import type { ClientMap } from '../../clients';
import type { ServiceMap } from '../../services';

export interface ControllerDependencies {
  services: ServiceMap;
  clients: ClientMap;
}

export abstract class AbstractController {
  public services: ServiceMap;

  public clients: ClientMap;

  constructor(public config: Config, { services, clients }: ControllerDependencies) {
    this.services = services;
    this.clients = clients;
  }
}
