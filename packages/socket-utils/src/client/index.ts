import { User } from '@socket-utils/model';

import { Cache } from './cache';
import { PubSub } from './pubsub';
import { Redis } from './redis';

export * from './cache';
export * from './pubsub';
export * from './redis';
export * from './types';

export interface BaseClientMap {
  cache: Cache;
  pubsub: PubSub;
  redis: Redis;
}

export interface BaseVoiceflowClient {
  user: {
    get(): Promise<User | null>;
  };
}
