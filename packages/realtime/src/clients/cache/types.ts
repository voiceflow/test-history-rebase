import * as Realtime from '@voiceflow/realtime-sdk';
import { Redis } from 'ioredis';

export type Hash = Record<string, string>;

export type BaseKeyExtractor = (keyOptions: any) => string;

export type AnyAdapter = Realtime.Adapters.AnyBidirectionalMultiAdapter;

export type BaseAdapter = Realtime.Adapters.BidirectionalMultiAdapter<string, any, [], []>;

export type BaseHashAdapter = Realtime.Adapters.BidirectionalMultiAdapter<Hash, any, [], []>;

export type Options<K extends BaseKeyExtractor, A extends AnyAdapter | undefined = undefined> = { keyCreator: K } & (A extends AnyAdapter
  ? { adapter: A }
  : { adapter?: never });

export type CacheOptions<K extends BaseKeyExtractor, A extends AnyAdapter | undefined = undefined> = Options<K, A> & {
  redis: Redis;
};

export type KeyOptions<K extends BaseKeyExtractor> = Parameters<K>[0];

export type StringToDB<A extends BaseAdapter | undefined = undefined> = A extends BaseAdapter ? Parameters<A['toDB']>[0] : string;

export type StringFromDB<A extends BaseAdapter | undefined = undefined> = A extends BaseAdapter ? ReturnType<A['fromDB']> : string;

export type HashToDB<A extends BaseHashAdapter | undefined = undefined> = A extends BaseHashAdapter ? Parameters<A['toDB']>[0] : Hash;

export type HashFromDB<A extends BaseHashAdapter | undefined = undefined> = A extends BaseHashAdapter ? ReturnType<A['fromDB']> : Hash;
