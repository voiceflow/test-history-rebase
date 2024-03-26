import type { Primary } from '@mikro-orm/core';
import { type EntityManager, ObjectId } from '@mikro-orm/mongodb';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { Inject, Injectable, Module } from '@nestjs/common';
import type { SmartMultiAdapter } from 'bidirectional-adapter';
import type { Filter, MatchKeysAndValues } from 'mongodb-mikro';

import { DatabaseTarget } from '@/common/enums/database-target.enum';
import type { ORM } from '@/common/interfaces/orm.interface';
import type { Constructor, CreateData, MongoPKEntity, ToJSON, ToObject, WhereData } from '@/types';

@Injectable()
@Module({})
export abstract class MongoORM<BaseEntity extends MongoPKEntity, DiscriminatorEntity extends BaseEntity = BaseEntity>
  implements ORM<BaseEntity, DiscriminatorEntity>
{
  DiscriminatorEntity?: DiscriminatorEntity;

  abstract Entity: Constructor<BaseEntity>;

  abstract jsonAdapter: SmartMultiAdapter<ToObject<BaseEntity>, ToJSON<BaseEntity>>;

  private cache: Partial<{
    lazyProperties: string[];
    onUpdateHandlers: Array<{ field: string; handler: (data: Partial<BaseEntity>) => unknown }>;
    uniqueProperties: string[];
  }> = {};

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.MONGO))
    protected readonly em: EntityManager
  ) {}

  protected get entityName() {
    return this.Entity.name;
  }

  protected get collection() {
    return this.em.getCollection<BaseEntity>(this.Entity);
  }

  protected get entityMetadata() {
    return this.em.getMetadata().get(this.entityName);
  }

  protected get uniqueProperties() {
    if (!this.entityMetadata.hasUniqueProps) {
      return [];
    }

    if (!this.cache.uniqueProperties) {
      this.cache.uniqueProperties = this.entityMetadata.uniques.flatMap(({ properties }) => properties);
    }

    return this.cache.uniqueProperties;
  }

  protected get lazyProperties() {
    if (this.cache.lazyProperties) {
      return this.cache.lazyProperties;
    }

    this.cache.lazyProperties = this.entityMetadata.hydrateProps.filter((prop) => prop.lazy).map((prop) => prop.name);

    return this.cache.lazyProperties;
  }

  protected idToFilter(id: Primary<BaseEntity>): Filter<BaseEntity> {
    if (typeof id === 'object' && '_bsontype' in id) {
      return { _id: id } as Filter<BaseEntity>;
    }

    if (typeof id === 'object') {
      return id as Filter<BaseEntity>;
    }

    return { _id: new ObjectId(id) } as Filter<BaseEntity>;
  }

  protected idsToFilter(ids: Primary<BaseEntity>[]): Filter<BaseEntity> {
    return { _id: { $in: ids.map((id) => this.idToFilter(id)._id) } } as Filter<BaseEntity>;
  }

  protected onPatch(data: Record<string, any>) {
    const nextData = { ...data };

    if (!this.cache.onUpdateHandlers) {
      this.cache.onUpdateHandlers = Object.values(this.entityMetadata.properties)
        .filter((property) => property.onUpdate)
        .map((property) => ({
          field: property.name,
          handler: property.onUpdate!,
        }));
    }

    this.cache.onUpdateHandlers.forEach(({ field, handler }) => {
      if (data[field] !== undefined) {
        nextData[field] = handler(data as any);
      }
    });

    return nextData as MatchKeysAndValues<any>;
  }

  protected projection(fields?: string[]) {
    const lazyProps = this.lazyProperties;

    if (fields?.length) return Object.fromEntries(fields.map((field) => [field, 1]));
    if (lazyProps?.length) return Object.fromEntries(lazyProps.map((field) => [field, 0]));

    return undefined;
  }

  protected buildWhere(where: WhereData<BaseEntity>) {
    return Object.fromEntries(
      Object.entries(where).map(([key, value]) => [key, Array.isArray(value) ? { $in: value } : { $eq: value }])
    ) as Filter<BaseEntity>;
  }

  find(where: WhereData<BaseEntity>): Promise<ToObject<DiscriminatorEntity>[]>;
  find<Field extends keyof ToObject<DiscriminatorEntity>>(
    where: WhereData<BaseEntity>,
    options: { fields: Field[] }
  ): Promise<Pick<ToObject<DiscriminatorEntity>, Field>[]>;
  find(where: WhereData<BaseEntity>, { fields }: { fields?: string[] } = {}) {
    return this.collection.find(this.buildWhere(where), { projection: this.projection(fields) }).toArray() as any;
  }

  findOne(id: Primary<BaseEntity>): Promise<ToObject<DiscriminatorEntity> | null>;
  findOne<Field extends keyof ToObject<DiscriminatorEntity>>(
    id: Primary<BaseEntity>,
    options: { fields: Field[] }
  ): Promise<Pick<ToObject<DiscriminatorEntity>, Field> | null>;
  findOne(id: Primary<BaseEntity>, { fields }: { fields?: string[] } = {}) {
    return this.collection.findOne(this.idToFilter(id), { projection: this.projection(fields) }) as any;
  }

  findMany(ids: Primary<BaseEntity>[]): Promise<ToObject<DiscriminatorEntity>[]>;
  findMany<Field extends keyof ToObject<DiscriminatorEntity>>(
    ids: Primary<BaseEntity>[],
    options: { fields: Field[] }
  ): Promise<Pick<ToObject<DiscriminatorEntity>, Field>[]>;
  findMany(ids: Primary<BaseEntity>[], { fields }: { fields?: string[] } = {}) {
    return this.collection.find(this.idsToFilter(ids), { projection: this.projection(fields) }).toArray() as any;
  }

  findOneOrFail(id: Primary<BaseEntity>): Promise<ToObject<DiscriminatorEntity>>;
  findOneOrFail<Field extends keyof ToObject<DiscriminatorEntity>>(
    id: Primary<BaseEntity>,
    options: { fields: Field[] }
  ): Promise<Pick<ToObject<DiscriminatorEntity>, Field>>;

  async findOneOrFail(id: Primary<BaseEntity>, options?: { fields?: string[] }) {
    const result = await this.findOne(id, options as any);

    if (result === null) {
      throw new Error(`Entity not found: ${this.entityName}#${id}`);
    }

    return result as any;
  }

  async createOne(data: CreateData<DiscriminatorEntity>) {
    const [result] = await this.createMany([data]);

    return result;
  }

  async createMany(data: CreateData<DiscriminatorEntity>[]) {
    if (!data.length) return [];

    const batchSize = this.em.config.get('batchSize');

    if (data.length > batchSize) {
      const batchResult: ToObject<DiscriminatorEntity>[] = [];

      for (let i = 0; i < data.length; i += batchSize) {
        const chunk = data.slice(i, i + batchSize);

        // eslint-disable-next-line no-await-in-loop
        batchResult.push(...(await this.createMany(chunk)));
      }

      return batchResult;
    }

    const { acknowledged, insertedCount, insertedIds } = await this.collection.insertMany(data as any[]);

    if (!acknowledged || insertedCount !== data.length) throw new Error('insert many error');

    return data.map((item, i) => ({
      ...item,
      _id: (item as any)._id ?? insertedIds[i],
    })) as ToObject<DiscriminatorEntity>[];
  }
}
