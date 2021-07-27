import BaseCache from './base';
import { BaseAdapter, BaseKeyExtractor, KeyOptions, StringFromDB, StringToDB } from './types';

class SetCache<K extends BaseKeyExtractor, A extends BaseAdapter | undefined = undefined> extends BaseCache<K, A> {
  public async add(keyOptions: KeyOptions<K>, value: StringToDB<A>): Promise<void> {
    await this.redis.sadd(this.keyCreator(keyOptions), this.adapter?.toDB(value) ?? value);
  }

  public async remove(keyOptions: KeyOptions<K>, value: StringToDB<A>): Promise<void> {
    await this.redis.srem(this.keyCreator(keyOptions), this.adapter?.toDB(value) ?? value);
  }

  public async values(keyOptions: KeyOptions<K>): Promise<StringFromDB<A>[]> {
    const members = await this.redis.smembers(this.keyCreator(keyOptions));

    return this.adapter?.mapFromDB(members) ?? members;
  }

  public async size(keyOptions: KeyOptions<K>): Promise<number> {
    return this.redis.scard(this.keyCreator(keyOptions));
  }
}

export default SetCache;
