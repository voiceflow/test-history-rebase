import type { FilterQuery, FindOptions, Primary } from '@mikro-orm/core';
import type { EntityManager } from '@mikro-orm/mongodb';
import { getEntityManagerToken, MikroOrmModule } from '@mikro-orm/nestjs';
import type { DynamicModule } from '@nestjs/common';
import { Inject, Injectable, Module } from '@nestjs/common';

import { DatabaseTarget } from '@/common/enums/database-target.enum';
import type { ORM } from '@/common/interfaces/orm.interface';
import type { Constructor, ORMMutateOptions, Ref } from '@/types';

import type { MongoEntity } from './entities/mongo.entity';

export const MongoORM = <Entity extends MongoEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity>
) => {
  @Injectable()
  @Module({})
  class MongoORM implements ORM<Entity, ConstructorParam> {
    _entity?: Entity;

    static register(): DynamicModule {
      const ormModule = MikroOrmModule.forFeature([Entity], DatabaseTarget.MONGO);

      return {
        module: this,
        imports: [ormModule],
        exports: [this],
      };
    }

    static primaryKeyToFilterQuery(id: Primary<Entity>) {
      return typeof id === 'object' ? id : ({ id } as FilterQuery<Entity>);
    }

    static primaryKeysToFilterQuery(id: Primary<Entity>[]) {
      return id.map((item) => MongoORM.primaryKeyToFilterQuery(item));
    }

    constructor(
      @Inject(getEntityManagerToken(DatabaseTarget.MONGO))
      readonly em: EntityManager
    ) {}

    find<Hint extends string = never>(where: FilterQuery<Entity>, options?: FindOptions<Entity, Hint>) {
      return this.em.find<Entity, Hint>(Entity, where, options);
    }

    findOne(id: Primary<Entity>) {
      return this.em.findOne<Entity>(Entity, MongoORM.primaryKeyToFilterQuery(id));
    }

    findMany(ids: Primary<Entity>[]) {
      return this.find(ids.map((item) => MongoORM.primaryKeyToFilterQuery(item)));
    }

    findOneOrFail(id: Primary<Entity>) {
      return this.em.findOneOrFail<Entity>(Entity, MongoORM.primaryKeyToFilterQuery(id));
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
