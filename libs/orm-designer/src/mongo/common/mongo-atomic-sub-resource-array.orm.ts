import type { Primary } from '@mikro-orm/core';
import type { DynamicModule } from '@nestjs/common';

import type { Constructor, ORMEntity } from '@/types';

import * as Atomic from './atomic';
import type { MongoAtomicORM } from './mongo-atomic.orm';
import { MongoAtomicSubResourceORM } from './mongo-atomic-sub-resource.orm';

export const MongoAtomicSubResourceArrayORM = <
  Orm extends MongoAtomicORM<any, any>,
  BaseResource,
  ID extends keyof BaseResource
>(
  ORM: Constructor<any[], Orm> & { register: () => DynamicModule },
  { id, path }: { id: ID; path: string }
) => {
  class MongoAtomicSubResourceArrayORMClass extends MongoAtomicSubResourceORM(ORM) {
    find<Resource extends BaseResource>(_entityID: Primary<ORMEntity<Orm>>): Promise<Resource[]> {
      throw new Error('not implemented');
    }

    async setAll<Resource extends BaseResource>(
      entityID: Primary<ORMEntity<Orm>>,
      resources: Resource[]
    ): Promise<void> {
      return this.orm.atomicUpdateOne(entityID, [Atomic.Set([{ path, value: resources }])]);
    }

    async createOne<Resource extends BaseResource>(
      entityID: Primary<ORMEntity<Orm>>,
      resource: Resource
    ): Promise<Resource> {
      await this.orm.atomicUpdateOne(entityID, [Atomic.Push([{ path, value: resource }])]);

      return resource;
    }

    async createMany<Resource extends BaseResource>(
      entityID: Primary<ORMEntity<Orm>>,
      resources: Resource[]
    ): Promise<Resource[]> {
      await this.orm.atomicUpdateOne(entityID, [Atomic.Push([{ path, value: resources }])]);

      return resources;
    }

    async findMany<Resource extends BaseResource>(
      entityID: Primary<ORMEntity<Orm>>,
      resourceIDs: BaseResource[ID][]
    ): Promise<Resource[]> {
      const resources = await this.find<Resource>(entityID);

      return resources.filter((resource) => resourceIDs.includes(resource[id]));
    }

    async findOne<Resource extends BaseResource>(
      entityID: Primary<ORMEntity<Orm>>,
      resourceID: string
    ): Promise<Resource | null> {
      const resources = await this.find<Resource>(entityID);

      return resources.find((resource) => resource[id] === resourceID) ?? null;
    }

    async findOneOrFail<Resource extends BaseResource>(
      entityID: Primary<ORMEntity<Orm>>,
      resourceID: string
    ): Promise<Resource> {
      const resource = await this.findOne<Resource>(entityID, resourceID);

      if (!resource) {
        throw new Error(`couldn't find resource ${resourceID}`);
      }

      return resource;
    }

    async updateOne(
      entityID: Primary<ORMEntity<Orm>>,
      resourceID: string,
      data: Partial<Omit<BaseResource, ID>>
    ): Promise<void> {
      return this.orm.atomicUpdateOne(
        entityID,
        Object.entries(data).map(([key, value]) => Atomic.Set([{ path: [path, { [id]: resourceID }, key], value }]))
      );
    }

    async deleteOne(entityID: Primary<ORMEntity<Orm>>, resourceID: string): Promise<void> {
      return this.orm.atomicUpdateOne(entityID, [Atomic.Pull([{ path, match: { [id]: resourceID } }])]);
    }

    async deleteMany(entityID: Primary<ORMEntity<Orm>>, resourceIDs: string[]): Promise<void> {
      return this.orm.atomicUpdateOne(entityID, [Atomic.Pull([{ path, match: { [id]: { $in: resourceIDs } } }])]);
    }
  }

  return MongoAtomicSubResourceArrayORMClass;
};
