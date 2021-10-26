import axios, { AxiosStatic } from 'axios';

import Cache from './cache';
import PubSubClient, { PubSub } from './pubsub';
import RedisClient, { Redis } from './redis';
import { BaseOptions } from './types';
import VoiceflowFactoryClient, { VoiceflowFactory } from './voiceflow';

export interface ClientMap {
  redis: Redis;
  pubsub: PubSub;
  cache: Cache;
  axios: AxiosStatic;
  voiceflowFactory: VoiceflowFactory;
}

const buildClients = ({ config }: BaseOptions): ClientMap => {
  const staticClients = {
    axios,
  };

  const redis = RedisClient({ config });
  const pubsub = PubSubClient({ config, redis });
  const cache = new Cache({ redis });
  const voiceflowFactory = VoiceflowFactoryClient({ axios, config });

  return {
    ...staticClients,
    redis,
    pubsub,
    cache,
    voiceflowFactory,
  };
};

export default buildClients;
