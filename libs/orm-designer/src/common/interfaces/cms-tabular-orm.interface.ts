import type { CreateData, DEFAULT_OR_NULL_COLUMN, PostgresPKEntity, ToObject } from '@/types';

import type { CMSObjectORM } from './cms-object-orm.interface';

export interface CMSTabularORM<
  BaseEntity extends PostgresPKEntity,
  DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN>,
> extends CMSObjectORM<BaseEntity, DiscriminatorEntity> {
  findManyByFolders(environmentID: string, folderIDs: string[]): Promise<ToObject<DiscriminatorEntity>[]>;

  findManyByEnvironment(environmentID: string): Promise<ToObject<DiscriminatorEntity>[]>;

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]): Promise<ToObject<DiscriminatorEntity>[]>;

  createOneForUser(
    userID: number,
    data: Omit<CreateData<DiscriminatorEntity>, 'createdByID' | 'updatedByID'>
  ): Promise<ToObject<DiscriminatorEntity>>;

  createManyForUser(
    userID: number,
    data: Omit<CreateData<DiscriminatorEntity>, 'createdByID' | 'updatedByID'>[]
  ): Promise<ToObject<DiscriminatorEntity>[]>;

  deleteManyByEnvironment(environmentID: string): Promise<number>;

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]): Promise<number>;
}
