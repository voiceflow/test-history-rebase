import { PubSub } from './pubsub';
import { Redis } from './redis';

export * from './pubsub';
export * from './redis';
export * from './types';

export interface BaseClientMap {
  pubsub: PubSub;
  redis: Redis;
}
