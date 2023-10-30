import type { FilterQuery, FindOneOptions, FindOneOrFailOptions, FindOptions, Loaded, Primary } from '@mikro-orm/core';
import { getEntityManagerToken, MikroOrmModule } from '@mikro-orm/nestjs';
import type { EntityManager } from '@mikro-orm/postgresql';
import type { DynamicModule } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import type { ORM } from '@/common';
import { DatabaseTarget } from '@/common/enums/database-target.enum';
import type { BaseEntity } from '@/common/interfaces/base-entity.interface';
import type { Constructor, ORMMutateOptions, Ref } from '@/types';

export const PostgresORM = <Entity extends BaseEntity, ConstructorParam extends object>(
  Entity: Constructor<[data: ConstructorParam], Entity>
) => {
  class PostgresORM implements ORM<Entity, ConstructorParam> {
    _entity?: Entity;

    static register(): DynamicModule {
      const ormModule = MikroOrmModule.forFeature([Entity], DatabaseTarget.POSTGRES);

      return {
        module: this,
        imports: [ormModule],
        exports: [this],
      };
    }

    static primaryKeyToFilterQuery(id: Primary<Entity>): FilterQuery<Entity> {
      return typeof id === 'object' ? id : ({ id } as FilterQuery<Entity>);
    }

    static primaryKeysToFilterQuery(id: Primary<Entity>[]): FilterQuery<Entity>[] {
      return id.map((item) => PostgresORM.primaryKeyToFilterQuery(item));
    }

    constructor(
      @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
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
      return this.em.findOne<Entity, Hint>(Entity, PostgresORM.primaryKeyToFilterQuery(id), options);
    }

    findMany<Hint extends string = never>(
      ids: Primary<Entity>[],
      options?: FindOptions<Entity, Hint>
    ): Promise<Loaded<Entity, Hint>[]> {
      return this.find(
        ids.map((item) => PostgresORM.primaryKeyToFilterQuery(item)),
        options
      );
    }

    findOneOrFail<Hint extends string = never>(id: Primary<Entity>, options?: FindOneOrFailOptions<Entity, Hint>) {
      return this.em.findOneOrFail<Entity, Hint>(Entity, PostgresORM.primaryKeyToFilterQuery(id), options);
    }

    async createOne(data: ConstructorParam, { flush = true }: ORMMutateOptions = {}): Promise<Entity> {
      const entity = new Entity(data);

      this.em.persist(entity);

      if (flush) {
        await this.em.flush();
      }

      return entity;
    }

    async createMany(data: ConstructorParam[], { flush = true }: ORMMutateOptions = {}): Promise<Entity[]> {
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

  return PostgresORM;
};
