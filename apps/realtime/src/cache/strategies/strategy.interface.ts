import type { AnyMultiAdapter, MultiAdapter } from 'bidirectional-adapter';
import type { Redis } from 'ioredis';

export type Hash = Record<string, string>;

export type BaseKeyExtractor = (keyOptions: any) => string;

export type AnyAdapter = AnyMultiAdapter;

export type BaseAdapter = MultiAdapter<string, any>;

export type BaseHashAdapter = MultiAdapter<Hash, any>;

export interface BaseOptions<K extends BaseKeyExtractor> {
  /**
   * Expire time in seconds. Used in the redis .expire method.
   */
  expire?: number;
  keyCreator: K;
}

export type Options<K extends BaseKeyExtractor, A extends AnyAdapter | undefined = undefined> = BaseOptions<K> &
  (A extends AnyAdapter ? { adapter: A } : { adapter?: never });

export type CacheOptions<K extends BaseKeyExtractor, A extends AnyAdapter | undefined = undefined> = Options<K, A> & {
  redis: Redis;
};

export type KeyOptions<K extends BaseKeyExtractor> = Parameters<K>[0];

export type StringToDB<A extends BaseAdapter | undefined = undefined> = A extends BaseAdapter ? Parameters<A['toDB']>[0] : string;

export type StringFromDB<A extends BaseAdapter | undefined = undefined> = A extends BaseAdapter ? ReturnType<A['fromDB']> : string;

export type HashToDB<A extends BaseHashAdapter | undefined = undefined> = A extends BaseHashAdapter ? Parameters<A['toDB']>[0] : Hash;

export type HashFromDB<A extends BaseHashAdapter | undefined = undefined> = A extends BaseHashAdapter ? ReturnType<A['fromDB']> : Hash;
