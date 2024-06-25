import type { CMSTabularORM } from '@/common';
import type { CreateData, DEFAULT_OR_NULL_COLUMN } from '@/types';

import type { PostgresCMSTabularEntity } from '../entities/postgres-cms-tabular.entity';
import { PostgresCMSObjectORM } from './postgres-cms-object.orm';

export abstract class PostgresCMSTabularORM<
    BaseEntity extends Omit<PostgresCMSTabularEntity, typeof DEFAULT_OR_NULL_COLUMN>,
    DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN> = BaseEntity,
  >
  extends PostgresCMSObjectORM<BaseEntity, DiscriminatorEntity>
  implements CMSTabularORM<BaseEntity, DiscriminatorEntity>
{
  findManyByFolders(environmentID: string, folderIDs: string[]) {
    return this.find({ environmentID, folderID: folderIDs } as any);
  }

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID } as any);
  }

  findManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.find({ environmentID, id: ids } as any);
  }

  createOneForUser(userID: number, data: Omit<CreateData<DiscriminatorEntity>, 'createdByID' | 'updatedByID'>) {
    return super.createOneForUser(userID, { ...data, createdByID: userID });
  }

  createManyForUser(userID: number, data: Omit<CreateData<DiscriminatorEntity>, 'createdByID' | 'updatedByID'>[]) {
    return super.createManyForUser(
      userID,
      data.map((item) => ({ ...item, createdByID: userID }))
    );
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID } as any);
  }

  deleteManyByEnvironmentAndIDs(environmentID: string, ids: string[]) {
    return this.delete({ environmentID, id: ids } as any);
  }
}
