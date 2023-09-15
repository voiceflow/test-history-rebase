import type { MutableORM, ORMEntity, ORMMutateOptions, ORMParam, PKOrEntity } from '@voiceflow/orm-designer';

import { BaseService } from './base.service';
import type { PatchManyData, PatchOneData } from './types';

export abstract class MutableService<O extends MutableORM<any, any>> extends BaseService<O> {
  protected abstract readonly orm: MutableORM<ORMEntity<O>, ORMParam<O>>;

  patchOne(id: PKOrEntity<ORMEntity<O>>, patch: PatchOneData<O>, options?: ORMMutateOptions) {
    return this.orm.patchOne(id, patch, options);
  }

  patchMany(ids: PKOrEntity<ORMEntity<O>>[], patch: PatchManyData<O>, options?: ORMMutateOptions) {
    return this.orm.patchMany(ids, patch, options);
  }

  deleteOne(id: PKOrEntity<ORMEntity<O>>, options?: { soft?: boolean; flush?: boolean }): Promise<void> {
    return this.orm.deleteOne(id, options);
  }

  deleteMany(ids: PKOrEntity<ORMEntity<O>>[], options?: { soft?: boolean; flush?: boolean }): Promise<void> {
    return this.orm.deleteMany(ids, options);
  }
}
