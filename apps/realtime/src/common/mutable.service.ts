import type { Primary } from '@mikro-orm/core';
import type { CreateData, MutableORM, ORMDiscriminatorEntity, ORMEntity, PatchData } from '@voiceflow/orm-designer';

import { BaseService } from './base.service';

export abstract class MutableService<Orm extends MutableORM<any, any>> extends BaseService<Orm> {
  protected abstract readonly orm: MutableORM<ORMEntity<Orm>, ORMDiscriminatorEntity<Orm>>;

  async patchOne(id: Primary<ORMEntity<Orm>>, patch: PatchData<ORMEntity<Orm>>) {
    await this.orm.patchOne(id, patch);
  }

  async patchMany(ids: Primary<ORMEntity<Orm>>[], patch: PatchData<ORMEntity<Orm>>) {
    await this.orm.patchMany(ids, patch);
  }

  upsertOne(data: CreateData<ORMDiscriminatorEntity<Orm>>) {
    return this.orm.upsertOne(data);
  }

  upsertMany(data: CreateData<ORMDiscriminatorEntity<Orm>>[]) {
    return this.orm.upsertMany(data);
  }

  async deleteOne(id: Primary<ORMEntity<Orm>>) {
    await this.orm.deleteOne(id);
  }

  async deleteMany(ids: Primary<ORMEntity<Orm>>[]) {
    await this.orm.deleteMany(ids);
  }
}
