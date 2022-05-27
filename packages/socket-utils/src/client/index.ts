import { Cache } from './cache';
import { PubSub } from './pubsub';
import { Redis } from './redis';

export * from './cache';
export * from './pubsub';
export * from './redis';
export * from './types';

export interface BaseClientMap {
  cache: Cache;
  redis: Redis;
  pubsub: PubSub;
}
