import { BaseServiceMap, SyncService, UserService } from '@voiceflow/socket-utils';

import logger from '@/logger';

import type { ClientMap } from '../clients';
import type { Client as VoiceflowClient } from '../clients/voiceflow';
import type { Config } from '../types';
import ConfigurationService from './configuration';
import InteractionService from './interaction';
import VoiceflowService from './voiceflow';

export interface ServiceMap extends BaseServiceMap<VoiceflowClient> {
  configuration: ConfigurationService;
  interaction: InteractionService;
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
    sync: new SyncService(serviceOptions),
    interaction: new InteractionService(serviceOptions),
    configuration: new ConfigurationService(serviceOptions),
    voiceflow: new VoiceflowService(serviceOptions),
  };

  Object.assign(services, serviceMap);

  return services;
};

export default buildServices;

export const stopServices = async (services: ServiceMap): Promise<void> => {
  try {
    await Promise.all([services.configuration?.stop(), services.interaction?.stop()]);
  } catch (error) {
    logger.error({ message: 'error while tearing down services', error });
  }
};
