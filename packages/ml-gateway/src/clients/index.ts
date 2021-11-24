import { BaseClientMap, PubSub, RedisClient } from '@voiceflow/socket-utils';
import axios, { AxiosStatic } from 'axios';

import { BaseOptions } from './types';

export interface ClientMap extends BaseClientMap {
  axios: AxiosStatic;
}

const buildClients = (options: BaseOptions): ClientMap => {
  const staticClients = {
    axios,
  };

  const redis = RedisClient(options);
  const pubsub = new PubSub({ ...options, redis });

  return {
    ...staticClients,
    redis,
    pubsub,
  };
};

export default buildClients;
