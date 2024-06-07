import type { Primary } from '@mikro-orm/core';

import type { MutableORM } from '@/common';
import type { CreateData, DEFAULT_OR_NULL_COLUMN, PatchData, PostgresPKEntity, ToObject, WhereData } from '@/types';

import { PostgresORM } from './postgres.orm';

export abstract class PostgresMutableORM<
    BaseEntity extends PostgresPKEntity,
    DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN> = BaseEntity,
  >
  extends PostgresORM<BaseEntity, DiscriminatorEntity>
  implements MutableORM<BaseEntity, DiscriminatorEntity>
{
  patch(where: WhereData<BaseEntity> | WhereData<BaseEntity>[], patch: PatchData<BaseEntity>) {
    const qb = this.qb.update(this.toDB(this.onPatch(patch) as any));

    const ignore = this.buildWhere(qb, where);

    if (ignore) return Promise.resolve(0);

    return this.executeQB(qb);
  }

  patchOne(id: Primary<BaseEntity>, patch: PatchData<BaseEntity>) {
    return this.patch(this.idToWhere(id), patch);
  }

  patchMany(ids: Primary<BaseEntity>[], patch: PatchData<BaseEntity>) {
    return this.patch(this.idsToWhere(ids), patch);
  }

  async upsertOne(data: CreateData<DiscriminatorEntity>) {
    const [result] = await this.upsertMany([data]);

    return result;
  }

  async upsertMany(data: CreateData<DiscriminatorEntity>[]) {
    return this._insertMany(data, { upsert: true });
  }

  async delete(where: WhereData<BaseEntity> | WhereData<BaseEntity>[], returning?: false): Promise<number>;

  async delete(
    where: WhereData<BaseEntity> | WhereData<BaseEntity>[],
    returning: true
  ): Promise<ToObject<DiscriminatorEntity>[]>;

  async delete(where: WhereData<BaseEntity> | WhereData<BaseEntity>[], returning?: boolean) {
    const qb = this.qb.delete();

    const ignore = this.buildWhere(qb, where);

    if (ignore) return Promise.resolve(returning ? [] : 0);

    if (!returning) {
      return qb;
    }

    this.buildReturning(qb);

    const result = await this.executeQB(qb);

    return this.mapFromDB(result);
  }

  deleteOne(id: Primary<BaseEntity>) {
    return this.delete(this.idToWhere(id));
  }

  deleteMany(ids: Primary<BaseEntity>[]) {
    return this.delete(this.idsToWhere(ids));
  }
}
