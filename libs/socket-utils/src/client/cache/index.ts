import type { Redis } from 'ioredis';

import * as adapters from './adapters';
import HashCache from './hash';
import KeyValueCache from './keyValue';
import SetCache from './set';
import type { BaseAdapter, BaseHashAdapter, BaseKeyExtractor, Options } from './types';

export type { Hash } from './types';
export { HashCache, KeyValueCache, SetCache };

export class Cache {
  private redis: Redis;

  adapters = adapters;

  constructor({ redis }: { redis: Redis }) {
    this.redis = redis;
  }

  createSet<K extends BaseKeyExtractor, A extends BaseAdapter | undefined = undefined>(
    options: Options<K, A>
  ): SetCache<K, A> {
    return new SetCache<K, A>({ redis: this.redis, ...options });
  }

  createHash<K extends BaseKeyExtractor, A extends BaseHashAdapter | undefined = undefined>(
    options: Options<K, A>
  ): HashCache<K, A> {
    return new HashCache<K, A>({ redis: this.redis, ...options });
  }

  createKeyValue<K extends BaseKeyExtractor, A extends BaseAdapter | undefined = undefined>(
    options: Options<K, A>
  ): KeyValueCache<K, A> {
    return new KeyValueCache<K, A>({ redis: this.redis, ...options });
  }
}
