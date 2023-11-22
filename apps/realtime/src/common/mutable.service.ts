import type { MutableORM, ORMEntity, ORMMutateOptions, ORMParam, PKOrEntity } from '@voiceflow/orm-designer';

import { BaseService } from './base.service';
import type { PatchManyData, PatchOneData, UpsertManyData, UpsertOneData } from './types';

export abstract class MutableService<Orm extends MutableORM<any, any>> extends BaseService<Orm> {
  protected abstract readonly orm: MutableORM<ORMEntity<Orm>, ORMParam<Orm>>;

  patchOne(id: PKOrEntity<ORMEntity<Orm>>, patch: PatchOneData<Orm>, options?: ORMMutateOptions): Promise<void> {
    return this.orm.patchOne(id, patch, options);
  }

  patchMany(ids: PKOrEntity<ORMEntity<Orm>>[], patch: PatchManyData<Orm>, options?: ORMMutateOptions): Promise<void> {
    return this.orm.patchMany(ids, patch, options);
  }

  upsertOne(data: UpsertOneData<Orm>, options?: ORMMutateOptions): Promise<ORMEntity<Orm>> {
    return this.orm.upsertOne(data, options);
  }

  upsertMany(data: UpsertManyData<Orm>, options?: ORMMutateOptions): Promise<ORMEntity<Orm>[]> {
    return this.orm.upsertMany(data, options);
  }

  deleteOne(id: PKOrEntity<ORMEntity<Orm>>, options?: { soft?: boolean; flush?: boolean }): Promise<void> {
    return this.orm.deleteOne(id, options);
  }

  deleteMany(ids: PKOrEntity<ORMEntity<Orm>>[], options?: { soft?: boolean; flush?: boolean }): Promise<void> {
    return this.orm.deleteMany(ids, options);
  }
}
