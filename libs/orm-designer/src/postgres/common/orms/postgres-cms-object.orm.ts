import type { Primary } from '@mikro-orm/core';

import type { CMSObjectORM } from '@/common';
import type { CreateData, DEFAULT_OR_NULL_COLUMN, PatchData } from '@/types';

import type { PostgresCMSObjectEntity } from '../entities/postgres-cms-object.entity';
import { PostgresCMSMutableORM } from './postgres-cms-mutable.orm';

export abstract class PostgresCMSObjectORM<
    BaseEntity extends Omit<PostgresCMSObjectEntity, typeof DEFAULT_OR_NULL_COLUMN>,
    DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN> = BaseEntity
  >
  extends PostgresCMSMutableORM<BaseEntity, DiscriminatorEntity>
  implements CMSObjectORM<BaseEntity, DiscriminatorEntity>
{
  createOneForUser(userID: number, data: Omit<CreateData<DiscriminatorEntity>, 'createdByID' | 'updatedByID'>) {
    return this.createOne({ ...data, updatedByID: userID } as CreateData<DiscriminatorEntity>);
  }

  createManyForUser(userID: number, data: Omit<CreateData<DiscriminatorEntity>, 'createdByID' | 'updatedByID'>[]) {
    return this.createMany(data.map((item) => ({ ...item, updatedByID: userID } as CreateData<DiscriminatorEntity>)));
  }

  patchOneForUser(userID: number, id: Primary<BaseEntity>, data: PatchData<BaseEntity>) {
    return this.patchOne(id, { ...data, updatedByID: userID });
  }

  patchManyForUser(userID: number, ids: Primary<BaseEntity>[], data: PatchData<BaseEntity>) {
    return this.patchMany(ids, { ...data, updatedByID: userID });
  }
}
