import BaseCache from './base';
import type { BaseAdapter, BaseKeyExtractor, KeyOptions, StringFromDB, StringToDB } from './types';

class KeyValueCache<K extends BaseKeyExtractor, A extends BaseAdapter | undefined = undefined> extends BaseCache<K, A> {
  private formatValue = (value: string | null): StringFromDB<A> | null => {
    if (value === null) {
      return null;
    }

    return this.adapter?.fromDB(value) ?? value;
  };

  public async get(keyOptions: KeyOptions<K>): Promise<null | StringFromDB<A>> {
    const value = await this.redis.get(this.keyCreator(keyOptions));

    return this.formatValue(value);
  }

  public async getMany(keyOptions: Array<KeyOptions<K>>): Promise<Array<null | StringFromDB<A>>> {
    const values = await this.redis.mget(keyOptions.map(this.keyCreator));

    return values.map(this.formatValue);
  }

  public async set(
    keyOptions: KeyOptions<K>,
    value: StringToDB<A>,
    { expire = this.expire }: { expire?: number } = {}
  ): Promise<void> {
    const dbKey = this.keyCreator(keyOptions);
    const dbValue = this.adapter?.toDB(value) ?? value;

    if (expire) {
      const pipeline = this.redis.pipeline().set(dbKey, dbValue);

      await this.setExpireInPipeline(pipeline, dbKey, { expire });
    } else {
      await this.redis.set(dbKey, dbValue);
    }
  }

  public async setMany(
    sets: [keyOptions: KeyOptions<K>, value: StringToDB<A>][],
    { expire = this.expire }: { expire?: number } = {}
  ): Promise<void> {
    const setsRecord = Object.fromEntries(
      sets.map(([key, value]) => [this.keyCreator(key), this.adapter?.toDB(value) ?? value])
    );

    if (expire) {
      const pipeline = this.redis.pipeline().mset(setsRecord);

      await this.setExpireInPipeline(pipeline, Object.keys(setsRecord), { expire });
    } else {
      await this.redis.mset(setsRecord);
    }
  }
}

export default KeyValueCache;
