import axios, { AxiosStatic } from 'axios';

import Cache from './cache';
import RedisClient, { Redis } from './redis';
import { BaseOptions } from './types';
import VoiceflowFactoryClient, { VoiceflowFactory } from './voiceflow';

export interface ClientMap {
  redis: Redis;
  cache: Cache;
  axios: AxiosStatic;
  voiceflowFactory: VoiceflowFactory;
}

const buildClients = ({ config }: BaseOptions): ClientMap => {
  const staticClients = {
    axios,
  };

  const redis = RedisClient({ config });
  const cache = new Cache({ redis });
  const voiceflowFactory = VoiceflowFactoryClient({ axios, config });

  return {
    ...staticClients,
    redis,
    cache,
    voiceflowFactory,
  };
};

export default buildClients;
