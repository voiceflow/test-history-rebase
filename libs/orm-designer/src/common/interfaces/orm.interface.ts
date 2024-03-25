import type { Primary } from '@mikro-orm/core';

import type { BasePKEntity, Constructor, CreateData, DEFAULT_OR_NULL_COLUMN, ToObject } from '@/types';

export interface ORM<
  BaseEntity extends BasePKEntity,
  DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN>
> {
  Entity: Constructor<BaseEntity>;

  DiscriminatorEntity?: DiscriminatorEntity;

  find(where: Partial<ToObject<BaseEntity>>): Promise<ToObject<DiscriminatorEntity>[]>;

  findOne(id: Primary<BaseEntity>): Promise<ToObject<DiscriminatorEntity> | null>;

  findMany(ids: Primary<BaseEntity>[]): Promise<ToObject<DiscriminatorEntity>[]>;

  findOneOrFail(id: Primary<BaseEntity>): Promise<ToObject<DiscriminatorEntity>>;

  createOne(data: CreateData<DiscriminatorEntity>): Promise<ToObject<DiscriminatorEntity>>;

  createMany(data: CreateData<DiscriminatorEntity>[]): Promise<ToObject<DiscriminatorEntity>[]>;
}
