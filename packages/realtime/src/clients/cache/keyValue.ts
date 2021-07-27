import BaseCache from './base';
import { DEFAULT_EXPIRE_MODE, DEFAULT_EXPIRE_TIME } from './constants';
import { BaseAdapter, BaseKeyExtractor, CacheOptions, KeyOptions, StringFromDB, StringToDB } from './types';

export interface KeyValueExtraOptions {
  expire?: boolean;
  expireMode?: string;
  expireTime?: number;
}

class KeyValueCache<K extends BaseKeyExtractor, A extends BaseAdapter | undefined = undefined> extends BaseCache<K, A> {
  private expire: boolean;

  private expireMode: string;

  private expireTime: number;

  constructor({ expire = true, expireMode, expireTime, ...options }: CacheOptions<K, A> & KeyValueExtraOptions) {
    super(options as CacheOptions<K, A>);

    this.expire = expire;
    this.expireMode = expireMode ?? DEFAULT_EXPIRE_MODE;
    this.expireTime = expireTime ?? DEFAULT_EXPIRE_TIME;
  }

  public async get(keyOptions: KeyOptions<K>): Promise<null | StringFromDB<A>> {
    const value = await this.redis.get(this.keyCreator(keyOptions));

    if (value === null) {
      return null;
    }

    return this.adapter?.fromDB(value) ?? value;
  }

  public async set(keyOptions: KeyOptions<K>, value: StringToDB<A>): Promise<void> {
    await this.redis.set(
      this.keyCreator(keyOptions),
      this.adapter?.toDB(value) ?? value,
      this.expire ? this.expireMode : undefined,
      this.expire ? this.expireTime : undefined
    );
  }
}

export default KeyValueCache;
