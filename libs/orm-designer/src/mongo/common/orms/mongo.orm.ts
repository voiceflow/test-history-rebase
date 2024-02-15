import type { FilterQuery, FindOneOptions, FindOneOrFailOptions, FindOptions, Loaded, Primary } from '@mikro-orm/core';
import type { EntityManager } from '@mikro-orm/mongodb';
import { ObjectId } from '@mikro-orm/mongodb';
import { getEntityManagerToken, MikroOrmModule } from '@mikro-orm/nestjs';
import type { DynamicModule } from '@nestjs/common';
import { Inject, Injectable, Module } from '@nestjs/common';

import { DatabaseTarget } from '@/common/enums/database-target.enum';
import type { ORM } from '@/common/interfaces/orm.interface';
import type { Constructor, EntityObject, MutableEntityData, ORMMutateOptions, Ref } from '@/types';

import type { MongoEntity } from '../entities/mongo.entity';

export const MongoORM = <Entity extends MongoEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity> & {
    fromJSON: (data: MutableEntityData<Entity>) => Partial<EntityObject<Entity>>;
  }
) => {
  @Injectable()
  @Module({})
  class MongoORM implements ORM<Entity, ConstructorParam> {
    _Entity = Entity;

    static register(): DynamicModule {
      const ormModule = MikroOrmModule.forFeature([Entity], DatabaseTarget.MONGO);

      return {
        module: this,
        imports: [ormModule],
        exports: [this],
      };
    }

    static primaryKeyToFilterQuery(id: Primary<Entity>): FilterQuery<Entity> {
      if (typeof id === 'object' && '_bsontype' in id) {
        return { _id: id } as FilterQuery<Entity>;
      }

      if (typeof id === 'object') {
        return Entity.fromJSON(id) as FilterQuery<Entity>;
      }

      return { _id: new ObjectId(id) } as FilterQuery<Entity>;
    }

    static primaryKeysToFilterQuery(id: Primary<Entity>[]) {
      return id.map((item) => MongoORM.primaryKeyToFilterQuery(item));
    }

    constructor(
      @Inject(getEntityManagerToken(DatabaseTarget.MONGO))
      readonly em: EntityManager
    ) {}

    find<Hint extends string = never>(
      where: FilterQuery<Entity>,
      options?: FindOptions<Entity, Hint>
    ): Promise<Loaded<Entity, Hint>[]> {
      return this.em.find<Entity, Hint>(Entity, where, options);
    }

    findOne<Hint extends string = never>(
      id: Primary<Entity>,
      options?: FindOneOptions<Entity, Hint>
    ): Promise<Loaded<Entity, Hint> | null> {
      return this.em.findOne<Entity, Hint>(Entity, MongoORM.primaryKeyToFilterQuery(id), options);
    }

    findMany<Hint extends string = never>(
      ids: Primary<Entity>[],
      options?: FindOptions<Entity, Hint>
    ): Promise<Loaded<Entity, Hint>[]> {
      return this.find(
        ids.map((item) => MongoORM.primaryKeyToFilterQuery(item)),
        options
      );
    }

    findOneOrFail<Hint extends string = never>(
      id: Primary<Entity>,
      options?: FindOneOrFailOptions<Entity, Hint>
    ): Promise<Loaded<Entity, Hint>> {
      return this.em.findOneOrFail<Entity, Hint>(Entity, MongoORM.primaryKeyToFilterQuery(id), options);
    }

    async createOne(data: ConstructorParam, { flush = true }: ORMMutateOptions = {}) {
      const entity = new Entity(data);

      this.em.persist(entity);

      if (flush) {
        await this.em.flush();
      }

      return entity;
    }

    async createMany(data: ConstructorParam[], { flush = true }: ORMMutateOptions = {}) {
      const entities = await Promise.all(data.map((item) => this.createOne(item, { flush: false })));

      if (flush) {
        await this.em.flush();
      }

      return entities;
    }

    getReference(id: Primary<Entity>, options: { wrapped: true }): Ref<Entity>;
    getReference(id: Primary<Entity>, options?: { wrapped?: false }): Entity;
    getReference(id: Primary<Entity>, options?: { wrapped?: boolean }) {
      return this.em.getReference(Entity, id as Primary<Entity>, options);
    }

    getReferences(ids: Primary<Entity>[], options: { wrapped: true }): Ref<Entity>[];
    getReferences(ids: Primary<Entity>[], options?: { wrapped?: false }): Entity[];
    getReferences(ids: Primary<Entity>[], options?: { wrapped?: boolean }) {
      if (options?.wrapped) {
        return ids.map((id) => this.getReference(id, { wrapped: true }));
      }

      return ids.map((id) => this.getReference(id));
    }
  }

  return MongoORM;
};

export type MongoORM<Type extends MongoEntity, ConstructorParam extends object> = InstanceType<
  ReturnType<typeof MongoORM<Type, ConstructorParam>>
>;
