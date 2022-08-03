import { BaseClientMap, Cache, PubSub, Redis, RedisClient } from '@voiceflow/socket-utils';
import axios, { AxiosStatic } from 'axios';
import { Adapter } from 'socket.io-adapter';
import { createAdapter as createIOAdapter } from 'socket.io-redis';

import MetricsClient, { Metrics } from './metrics';
import MongoClient from './mongo';
import { BaseOptions } from './types';
import VoiceflowFactoryClient, { VoiceflowFactory } from './voiceflow';

export interface ClientMap extends BaseClientMap {
  iopub: Redis;
  iosub: Redis;
  mongo: MongoClient;
  axios: AxiosStatic;
  metrics: Metrics;
  ioAdapter: typeof Adapter;
  voiceflowFactory: VoiceflowFactory;
}

const buildClients = (options: BaseOptions): ClientMap => {
  const staticClients = {
    axios,
  };

  const redis = RedisClient(options);
  const cache = new Cache({ redis });
  const mongo = new MongoClient(options);
  const iopub = redis.duplicate();
  const iosub = redis.duplicate();
  const pubsub = new PubSub({ ...options, redis });
  const metrics = MetricsClient(options);
  const ioAdapter = createIOAdapter({ pubClient: iopub, subClient: iosub });
  const voiceflowFactory = VoiceflowFactoryClient({ ...options, axios });

  return {
    ...staticClients,
    iopub,
    mongo,
    iosub,
    redis,
    cache,
    pubsub,
    metrics,
    ioAdapter,
    voiceflowFactory,
  };
};

export default buildClients;

export const stopClients = async (clients: ClientMap): Promise<void> => {
  await Promise.allSettled([
    clients.metrics?.stop(),
    clients.pubsub.subscriber.quit(),
    clients.iopub.quit(),
    clients.iosub.quit(),
    clients.redis.quit(),
  ]);
};
