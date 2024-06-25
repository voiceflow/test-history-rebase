import type { Cache } from './cache';
import type { PubSub } from './pubsub';
import type { Redis } from './redis';

export * from './cache';
export * from './pubsub';
export * from './redis';
export * from './types';

export interface BaseClientMap {
  cache: Cache;
  redis: Redis;
  pubsub: PubSub;
}
