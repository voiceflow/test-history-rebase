import type { Primary } from '@mikro-orm/core';

import type { BasePKEntity, CreateData, DEFAULT_OR_NULL_COLUMN, PatchData, ToObject } from '@/types';

import type { ORM } from './orm.interface';

export interface MutableORM<
  BaseEntity extends BasePKEntity,
  DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN>
> extends ORM<BaseEntity, DiscriminatorEntity> {
  patch(where: any, patch: PatchData<BaseEntity>): Promise<number>;

  patchOne(id: Primary<BaseEntity>, patch: PatchData<BaseEntity>): Promise<number>;

  patchMany(ids: Primary<BaseEntity>[], patch: PatchData<BaseEntity>): Promise<number>;

  upsertOne(data: CreateData<DiscriminatorEntity>): Promise<ToObject<DiscriminatorEntity>>;

  upsertMany(data: CreateData<DiscriminatorEntity>[]): Promise<ToObject<DiscriminatorEntity>[]>;

  delete(where: any): Promise<number>;

  deleteOne(id: Primary<BaseEntity>): Promise<number>;

  deleteMany(ids: Primary<BaseEntity>[]): Promise<number>;
}
