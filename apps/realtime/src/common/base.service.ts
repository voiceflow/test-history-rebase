import type { Primary } from '@mikro-orm/core';
import { NotFoundException } from '@voiceflow/exception';
import type { ORM, ORMEntity, ORMMutateOptions, ORMParam, Ref, ToJSONWithForeignKeys } from '@voiceflow/orm-designer';

import type { CreateManyData, CreateOneData } from './types';

export abstract class BaseService<Orm extends ORM<any, any>> {
  protected abstract readonly orm: ORM<ORMEntity<Orm>, ORMParam<Orm>>;

  getReference(id: Primary<ORMEntity<Orm>>, options: { wrapped: true }): Ref<ORMEntity<Orm>>;

  getReference(id: Primary<ORMEntity<Orm>>, options?: { wrapped?: false }): ORMEntity<Orm>;

  getReference(id: Primary<ORMEntity<Orm>>, options?: { wrapped?: boolean }) {
    if (options?.wrapped) {
      return this.orm.getReference(id, { wrapped: true });
    }

    return this.orm.getReference(id);
  }

  getReferences(ids: Primary<ORMEntity<Orm>>[], options: { wrapped: true }): Ref<ORMEntity<Orm>>[];

  getReferences(ids: Primary<ORMEntity<Orm>>[], options?: { wrapped?: false }): ORMEntity<Orm>[];

  getReferences(ids: Primary<ORMEntity<Orm>>[], options?: { wrapped?: boolean }) {
    if (options?.wrapped) {
      return this.orm.getReferences(ids, { wrapped: true });
    }

    return this.orm.getReferences(ids);
  }

  createOne(data: CreateOneData<Orm>, options?: ORMMutateOptions): Promise<ORMEntity<Orm>> {
    return this.orm.createOne(data, options);
  }

  createMany(data: CreateManyData<Orm>, options?: ORMMutateOptions): Promise<ORMEntity<Orm>[]> {
    return this.orm.createMany(data, options);
  }

  findOne(entity: Primary<ORMEntity<Orm>>): Promise<ORMEntity<Orm> | null> {
    return this.orm.findOne(entity);
  }

  findMany(entities: Primary<ORMEntity<Orm>>[]): Promise<ORMEntity<Orm>[]> {
    return this.orm.findMany(entities);
  }

  async findOneOrFail(entity: Primary<ORMEntity<Orm>>): Promise<ORMEntity<Orm>> {
    try {
      return await this.orm.findOneOrFail(entity);
    } catch (err) {
      // eslint-disable-next-line no-proto
      const entityName = ((this.orm as any)?.__proto__?.constructor?.name ?? 'resource').replace('ORM', '');

      if (typeof entity === 'string') {
        throw new NotFoundException(`Failed to find ${entityName} with ID ${entity}`);
      } else {
        throw new NotFoundException(`Failed to find ${entityName} with ${JSON.stringify(entity)}`);
      }
    }
  }
}
