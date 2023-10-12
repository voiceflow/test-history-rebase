import type { FilterQuery, FindOptions, Loaded, Primary } from '@mikro-orm/core';

import type { ORMMutateOptions, PKEntity, Ref } from '@/types';

export interface ORM<Entity extends PKEntity, ConstructorParam extends object> {
  _entity?: Entity;

  find<Hint extends string = never>(
    where: FilterQuery<Entity>,
    options?: FindOptions<Entity, Hint>
  ): Promise<Loaded<Entity, Hint>[]>;

  findOne(id: Primary<Entity>): Promise<Entity | null>;

  findMany(ids: Primary<Entity>[]): Promise<Entity[]>;

  findOneOrFail(id: Primary<Entity>): Promise<Entity>;

  createOne(data: ConstructorParam, options?: ORMMutateOptions): Promise<Entity>;

  createMany(data: ConstructorParam[], options?: ORMMutateOptions): Promise<Entity[]>;

  getReference(id: Primary<Entity>, options: { wrapped: true }): Ref<Entity>;
  getReference(id: Primary<Entity>, options?: { wrapped?: false }): Entity;

  getReferences(ids: Primary<Entity>[], options: { wrapped: true }): Ref<Entity>[];
  getReferences(ids: Primary<Entity>[], options?: { wrapped?: false }): Entity[];
}
