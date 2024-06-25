import type { BaseClientMap, Redis } from '@voiceflow/socket-utils';
import { Cache, PubSub, RedisClient } from '@voiceflow/socket-utils';
import type { AxiosStatic } from 'axios';
import axios from 'axios';
import type { Adapter } from 'socket.io-adapter';
import { createAdapter as createIOAdapter } from 'socket.io-redis';

import Hashids from './hashids';
import MongoClient from './mongo';
import type { BaseOptions } from './types';
import UnleashClient from './unleash';
import type { VoiceflowFactory } from './voiceflow';
import VoiceflowFactoryClient from './voiceflow';

export interface ClientMap extends BaseClientMap {
  iopub: Redis;
  iosub: Redis;
  mongo: MongoClient;
  axios: AxiosStatic;
  unleash: UnleashClient;
  ioAdapter: typeof Adapter;
  teamHashids: Hashids;
  voiceflowFactory: VoiceflowFactory;
}

const buildClients = (options: BaseOptions): ClientMap => {
  const staticClients = {
    axios,
  };

  const redis = RedisClient({ ...options, lazyConnect: true });
  const cache = new Cache({ redis });
  const mongo = new MongoClient(options);
  const iopub = redis.duplicate({ lazyConnect: true });
  const iosub = redis.duplicate({ lazyConnect: true });
  const pubsub = new PubSub({ ...options, redis, lazyConnect: true });
  const unleash = new UnleashClient(options);
  const ioAdapter = createIOAdapter({ pubClient: iopub, subClient: iosub });
  const teamHashids = new Hashids(options.config.TEAM_HASH, 10);
  const voiceflowFactory = VoiceflowFactoryClient({ ...options, axios });

  return {
    ...staticClients,
    iopub,
    mongo,
    iosub,
    redis,
    cache,
    pubsub,
    unleash,
    ioAdapter,
    teamHashids,
    voiceflowFactory,
  };
};

export default buildClients;

export const stopClients = async (clients: ClientMap): Promise<void> => {
  await Promise.allSettled([
    clients.pubsub.subscriber.quit(),
    clients.iopub.quit(),
    clients.iosub.quit(),
    clients.redis.quit(),
  ]);
};
