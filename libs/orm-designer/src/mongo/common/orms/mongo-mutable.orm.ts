import type { Primary } from '@mikro-orm/core';
import { Utils } from '@voiceflow/common';
import type { Filter } from 'mongodb-mikro';

import type { MutableORM } from '@/common';
import type { CreateData, PatchData, ToObject } from '@/types';

import type { MongoEntity } from '../entities/mongo.entity';
import { MongoORM } from './mongo.orm';

export abstract class MongoMutableORM<
    BaseEntity extends MongoEntity,
    DiscriminatorEntity extends BaseEntity = BaseEntity
  >
  extends MongoORM<BaseEntity, DiscriminatorEntity>
  implements MutableORM<BaseEntity, DiscriminatorEntity>
{
  async patch(where: Filter<BaseEntity>, patch: PatchData<BaseEntity>) {
    const { modifiedCount } = await this.collection.updateMany(where, { $set: this.onPatch(patch) });

    return modifiedCount;
  }

  async patchOne(id: Primary<BaseEntity>, patch: PatchData<BaseEntity>) {
    const { modifiedCount } = await this.collection.updateOne(this.idToFilter(id), { $set: this.onPatch(patch) });

    return modifiedCount;
  }

  patchMany(ids: Primary<BaseEntity>[], patch: PatchData<BaseEntity>) {
    return this.patch(this.idsToFilter(ids), patch);
  }

  async upsertOne(data: CreateData<DiscriminatorEntity>) {
    const [result] = await this.upsertMany([data]);

    return result;
  }

  async upsertMany(data: CreateData<DiscriminatorEntity>[]) {
    if (!data.length) return [];

    const batchSize = this.em.config.get('batchSize');

    if (data.length > batchSize) {
      const batchResult: ToObject<DiscriminatorEntity>[] = [];

      for (let i = 0; i < data.length; i += batchSize) {
        const chunk = data.slice(i, i + batchSize);

        // eslint-disable-next-line no-await-in-loop
        batchResult.push(...(await this.upsertMany(chunk)));
      }

      return batchResult;
    }

    const { uniqueProperties } = this;

    const itemFilter = (item: any) =>
      uniqueProperties.length ? Utils.object.pick(item, uniqueProperties) : this.idToFilter(item._id);

    const { upsertedCount, modifiedCount } = await this.collection.bulkWrite(
      data.map((item) => ({
        updateOne: {
          filter: itemFilter(item),
          update: { $set: item as any },
          upsert: true,
        },
      }))
    );

    if (upsertedCount + modifiedCount !== data.length) {
      throw new Error(
        `Failed to upsert: ${this.entityName}#${data
          .map((item) => (item as any)._id)
          .filter(Boolean)
          .join(', ')}`
      );
    }

    return this.collection.find({ $or: data.map(itemFilter) }).toArray() as any;
  }

  async delete(where: Filter<BaseEntity>) {
    const { deletedCount } = await this.collection.deleteMany(where as Filter<BaseEntity>);

    return deletedCount;
  }

  async deleteOne(id: Primary<BaseEntity>) {
    const { deletedCount } = await this.collection.deleteOne(this.idToFilter(id));

    return deletedCount;
  }

  deleteMany(ids: Primary<BaseEntity>[]) {
    return this.delete(this.idsToFilter(ids));
  }
}
