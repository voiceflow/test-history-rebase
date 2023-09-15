import type { Ref } from '@mikro-orm/core';
import { NotFoundException } from '@voiceflow/exception';
import type { ORM, ORMEntity, ORMMutateOptions, ORMParam, PKOrEntity } from '@voiceflow/orm-designer';

import type { CreateManyData, CreateOneData } from './types';

export abstract class BaseService<O extends ORM<any, any>> {
  protected abstract readonly orm: ORM<ORMEntity<O>, ORMParam<O>>;

  getReference(id: string, options: { wrapped: true }): Ref<ORMEntity<O>>;

  getReference(id: string, options?: { wrapped?: false }): ORMEntity<O>;

  getReference(id: string, options?: { wrapped?: boolean }) {
    if (options?.wrapped) {
      return this.orm.getReference(id, { wrapped: true });
    }

    return this.orm.getReference(id);
  }

  getReferences(ids: string[], options: { wrapped: true }): Ref<ORMEntity<O>>[];

  getReferences(ids: string[], options?: { wrapped?: false }): ORMEntity<O>[];

  getReferences(ids: string[], options?: { wrapped?: boolean }) {
    if (options?.wrapped) {
      return this.orm.getReferences(ids, { wrapped: true });
    }

    return this.orm.getReferences(ids);
  }

  createOne(data: CreateOneData<O>, options?: ORMMutateOptions) {
    return this.orm.createOne(data, options);
  }

  createMany(data: CreateManyData<O>, options?: ORMMutateOptions) {
    return this.orm.createMany(data, options);
  }

  findOne(entity: PKOrEntity<ORMEntity<O>>) {
    return this.orm.findOne(entity);
  }

  findMany(entities: PKOrEntity<ORMEntity<O>>[]) {
    return this.orm.findMany(entities);
  }

  async findOneOrFail(entity: PKOrEntity<ORMEntity<O>>) {
    try {
      return await this.orm.findOneOrFail(entity);
    } catch {
      const id = typeof entity === 'string' ? entity : (entity as { id: string }).id;
      throw new NotFoundException(`Failed to find resource with ID ${id}`);
    }
  }
}
