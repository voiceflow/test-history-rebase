import { BaseClientMap, PubSubClient, RedisClient } from '@voiceflow/socket-utils';
import axios, { AxiosStatic } from 'axios';

import Cache from './cache';
import { BaseOptions } from './types';
import VoiceflowFactoryClient, { VoiceflowFactory } from './voiceflow';

export interface ClientMap extends BaseClientMap {
  cache: Cache;
  axios: AxiosStatic;
  voiceflowFactory: VoiceflowFactory;
}

const buildClients = (options: BaseOptions): ClientMap => {
  const staticClients = {
    axios,
  };

  const redis = RedisClient(options);
  const pubsub = PubSubClient({ ...options, redis });
  const cache = new Cache({ redis });
  const voiceflowFactory = VoiceflowFactoryClient({ ...options, axios });

  return {
    ...staticClients,
    redis,
    pubsub,
    cache,
    voiceflowFactory,
  };
};

export default buildClients;
