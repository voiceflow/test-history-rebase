import type { Primary } from '@mikro-orm/core';

import type { CreateData, DEFAULT_OR_NULL_COLUMN, PatchData, PostgresPKEntity, ToObject } from '@/types';

import type { MutableORM } from './mutable-orm.interface';

export interface CMSObjectORM<
  BaseEntity extends PostgresPKEntity,
  DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN>,
> extends MutableORM<BaseEntity, DiscriminatorEntity> {
  createOneForUser(
    userID: number,
    data: Omit<CreateData<DiscriminatorEntity>, 'createdByID' | 'updatedByID'>
  ): Promise<ToObject<DiscriminatorEntity>>;

  createManyForUser(
    userID: number,
    data: Omit<CreateData<DiscriminatorEntity>, 'createdByID' | 'updatedByID'>[]
  ): Promise<ToObject<DiscriminatorEntity>[]>;

  patchOneForUser(userID: number, id: Primary<BaseEntity>, data: PatchData<BaseEntity>): Promise<number>;

  patchManyForUser(userID: number, ids: Primary<BaseEntity>[], data: PatchData<BaseEntity>): Promise<number>;
}
