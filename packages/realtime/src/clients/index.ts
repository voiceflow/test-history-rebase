import { BaseClientMap, PubSub, RedisClient } from '@voiceflow/socket-utils';
import axios, { AxiosStatic } from 'axios';

import Cache from './cache';
import MetricsClient, { Metrics } from './metrics';
import { BaseOptions } from './types';
import VoiceflowFactoryClient, { VoiceflowFactory } from './voiceflow';

export interface ClientMap extends BaseClientMap {
  cache: Cache;
  axios: AxiosStatic;
  voiceflowFactory: VoiceflowFactory;
  metrics: Metrics;
}

const buildClients = (options: BaseOptions): ClientMap => {
  const staticClients = {
    axios,
  };

  const redis = RedisClient(options);
  const pubsub = new PubSub({ ...options, redis });
  const cache = new Cache({ redis });
  const voiceflowFactory = VoiceflowFactoryClient({ ...options, axios });
  const metrics = MetricsClient(options);

  return {
    ...staticClients,
    redis,
    pubsub,
    cache,
    voiceflowFactory,
    metrics,
  };
};

export default buildClients;

export const stopClients = async (clients: ClientMap): Promise<void> => {
  await Promise.allSettled([clients.metrics?.stop(), clients.redis.quit(), clients.pubsub.subscriber.quit()]);
};
