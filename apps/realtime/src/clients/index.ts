import { BaseClientMap, Cache, PubSub, Redis, RedisClient } from '@voiceflow/socket-utils';
import axios, { AxiosStatic } from 'axios';
import { Adapter } from 'socket.io-adapter';
import { createAdapter as createIOAdapter } from 'socket.io-redis';

import Hashids from './hashids';
import MetricsClient, { Metrics } from './metrics';
import MongoClient from './mongo';
import { BaseOptions } from './types';
import UnleashClient from './unleash';
import VoiceflowFactoryClient, { VoiceflowFactory } from './voiceflow';

export interface ClientMap extends BaseClientMap {
  iopub: Redis;
  iosub: Redis;
  mongo: MongoClient;
  axios: AxiosStatic;
  unleash: UnleashClient;
  metrics: Metrics;
  ioAdapter: typeof Adapter;
  teamHashids: Hashids;
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
  // const unleash = new UnleashClient(options);
  const ioAdapter = createIOAdapter({ pubClient: iopub, subClient: iosub });
  const teamHashids = new Hashids(options.config.TEAM_HASH, 10);
  // const voiceflowFactory = VoiceflowFactoryClient({ ...options, axios });

  return {
    ...staticClients,
    iopub,
    mongo,
    iosub,
    redis,
    cache,
    pubsub,
    // unleash,
    metrics,
    ioAdapter,
    teamHashids,
    // voiceflowFactory,
  } as any;
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
