import type { Primary } from '@mikro-orm/core';
import type { CMSObjectORM, CreateData, ORMDiscriminatorEntity, ORMEntity, PatchData } from '@voiceflow/orm-designer';

import { MutableService } from './mutable.service';

export abstract class CMSObjectService<Orm extends CMSObjectORM<any, any>> extends MutableService<Orm> {
  protected abstract readonly orm: CMSObjectORM<ORMEntity<Orm>, ORMDiscriminatorEntity<Orm>>;

  createOneForUser(userID: number, data: Omit<CreateData<ORMDiscriminatorEntity<Orm>>, 'createdByID' | 'updatedByID'>) {
    return this.orm.createOneForUser(userID, data);
  }

  createManyForUser(
    userID: number,
    data: Omit<CreateData<ORMDiscriminatorEntity<Orm>>, 'createdByID' | 'updatedByID'>[]
  ) {
    return this.orm.createManyForUser(userID, data);
  }

  async patchOneForUser(userID: number, id: Primary<ORMEntity<Orm>>, data: PatchData<ORMEntity<Orm>>) {
    await this.orm.patchOneForUser(userID, id, data);
  }

  async patchManyForUser(userID: number, ids: Primary<ORMEntity<Orm>>[], data: PatchData<ORMEntity<Orm>>) {
    await this.orm.patchManyForUser(userID, ids, data);
  }
}
