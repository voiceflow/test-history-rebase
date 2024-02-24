import type { CMSObjectORM, ORMEntity, ORMMutateOptions, ORMParam, PKOrEntity } from '@voiceflow/orm-designer';

import { MutableService } from './mutable.service';
import type { CreateManyForUserData, CreateOneForUserData, PatchManyForUserData, PatchOneForUserData } from './types';

export abstract class CMSObjectService<Orm extends CMSObjectORM<any, any>> extends MutableService<Orm> {
  protected abstract readonly orm: CMSObjectORM<ORMEntity<Orm>, ORMParam<Orm>>;

  createOneForUser(userID: number, data: CreateOneForUserData<Orm>, options?: ORMMutateOptions): Promise<ORMEntity<Orm>> {
    return this.orm.createOneForUser(userID, data, options);
  }

  createManyForUser(userID: number, data: CreateManyForUserData<Orm>, options?: ORMMutateOptions): Promise<ORMEntity<Orm>[]> {
    return this.orm.createManyForUser(userID, data, options);
  }

  patchOneForUser(userID: number, id: PKOrEntity<ORMEntity<Orm>>, data: PatchOneForUserData<Orm>, options?: ORMMutateOptions): Promise<void> {
    return this.orm.patchOneForUser(userID, id, data, options);
  }

  async patchManyForUser(
    userID: number,
    ids: PKOrEntity<ORMEntity<Orm>>[],
    data: PatchManyForUserData<Orm>,
    options?: ORMMutateOptions
  ): Promise<void> {
    if ((data as any).folderID === null) {
      await Promise.all(ids.map((id) => (this.orm as any).em?.qb?.(this.orm._Entity.name)?.update({ folder_id: null }).where(id).execute()));
    }
    return this.orm.patchManyForUser(userID, ids, data, options);
  }
}
