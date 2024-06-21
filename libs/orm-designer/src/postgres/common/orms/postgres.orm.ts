import type { EntityProperty, Primary } from '@mikro-orm/core';
import { ReferenceKind } from '@mikro-orm/core';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import type { AbstractSqlPlatform, EntityManager, Knex } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import type { SmartMultiAdapter } from 'bidirectional-adapter';

import type { ORM } from '@/common';
import { DatabaseTarget } from '@/common/enums/database-target.enum';
import type {
  Constructor,
  CreateData,
  DEFAULT_OR_NULL_COLUMN,
  OrderByData,
  PostgresPKEntity,
  ToJSON,
  ToObject,
  WhereData,
} from '@/types';

interface ToDBOptions {
  ignoreObjectAdapter?: boolean;
  ignoreValueTransform?: boolean;
}

export abstract class PostgresORM<
  BaseEntity extends PostgresPKEntity,
  DiscriminatorEntity extends Omit<BaseEntity, typeof DEFAULT_OR_NULL_COLUMN> = BaseEntity,
> implements ORM<BaseEntity, DiscriminatorEntity>
{
  DiscriminatorEntity?: DiscriminatorEntity;

  abstract Entity: Constructor<BaseEntity>;

  abstract jsonAdapter: SmartMultiAdapter<ToObject<BaseEntity>, ToJSON<ToObject<BaseEntity>>>;

  protected objectAdapter?: SmartMultiAdapter<ToObject<BaseEntity>, ToObject<BaseEntity>>;

  protected discriminators?: Array<{
    Entity: Constructor<any>;
    jsonAdapter: SmartMultiAdapter<any, any>;
    objectAdapter?: SmartMultiAdapter<any, any>;
  }>;

  private cache: Partial<{
    platform: AbstractSqlPlatform;
    dbToJSKeyMap: Record<string, string>;
    jsToDBKeyMap: Record<string, string>;
    hiddenJSKeys: Set<string>;
    dbPrimaryKeys: string[];
    jsKeyToPropertyMap: Record<string, EntityProperty>;
    allSelectQuery: string;
    discriminatorMap: Record<
      string,
      {
        Entity: Constructor<any>;
        jsKeys: string[];
        jsonAdapter: SmartMultiAdapter<any, any>;
        objectAdapter?: SmartMultiAdapter<any, any>;
      }
    >;
    onUpdateHandlers: Array<{ field: string; handler: (data: Partial<BaseEntity>) => unknown }>;
    hasAnyObjectAdapter: boolean;
  }> = {};

  constructor(
    @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES))
    protected readonly em: EntityManager
  ) {}

  protected get qb() {
    return this.em.getContext().qb(this.entityName).getKnex();
  }

  protected get knex() {
    return this.em.getContext().getKnex();
  }

  protected get platform() {
    if (!this.cache.platform) {
      this.cache.platform = this.em.getPlatform();
    }

    return this.cache.platform;
  }

  protected get entityName() {
    return this.Entity.name;
  }

  protected get entityMetadata() {
    return this.em.getMetadata().get(this.entityName);
  }

  protected get dbToJSKeyMap() {
    return this.cache.dbToJSKeyMap ?? this.keyRemaps.dbToJSKey;
  }

  protected get jsToDBKeyMap() {
    return this.cache.jsToDBKeyMap ?? this.keyRemaps.jsToDBKey;
  }

  protected get jsKeyToDBPropertyMap() {
    return this.cache.jsKeyToPropertyMap ?? this.keyRemaps.jsKeyToProperty;
  }

  protected get dbPrimaryKeys() {
    if (!this.cache.dbPrimaryKeys) {
      this.cache.dbPrimaryKeys = Object.values(this.jsKeyToDBPropertyMap)
        .filter((prop) => prop.primary)
        .map((prop) => (prop as any).fieldName ?? prop.fieldNames[0]);
    }

    return this.cache.dbPrimaryKeys;
  }

  protected get hiddenJSKeys() {
    return this.cache.hiddenJSKeys ?? this.keyRemaps.hiddenJSKeys;
  }

  protected get keyRemaps() {
    if (
      this.cache.jsToDBKeyMap &&
      this.cache.dbToJSKeyMap &&
      this.cache.jsKeyToPropertyMap &&
      this.cache.hiddenJSKeys
    ) {
      return {
        dbToJSKey: this.cache.dbToJSKeyMap,
        jsToDBKey: this.cache.jsToDBKeyMap,
        jsKeyToProperty: this.cache.jsKeyToPropertyMap,
        hiddenJSKeys: this.cache.hiddenJSKeys,
      };
    }

    const { hydrateProps } = this.entityMetadata;

    const dbToJSKey: Record<string, string> = {};
    const jsToDBKey: Record<string, string> = {};
    const jsKeyToProperty: Record<string, EntityProperty> = {};
    const hiddenJSKeys: Set<string> = new Set();

    const builded = (prop: EntityProperty) => {
      const dbName = (prop as any).fieldName ?? prop.fieldNames[0];
      const jsName = this.propertyToObjectKey(prop);

      if (prop.hidden) {
        hiddenJSKeys.add(jsName);
      }

      if (!dbToJSKey[dbName]) {
        dbToJSKey[dbName] = jsName;
      }

      if (!jsToDBKey[jsName]) {
        jsToDBKey[jsName] = dbName;
        jsKeyToProperty[jsName] = prop;
      }
    };

    hydrateProps.forEach(builded);
    this.discriminators?.forEach(({ Entity }) => this.em.getMetadata().get(Entity.name).hydrateProps.forEach(builded));

    this.cache.dbToJSKeyMap = dbToJSKey;
    this.cache.jsToDBKeyMap = jsToDBKey;
    this.cache.hiddenJSKeys = hiddenJSKeys;

    return {
      dbToJSKey,
      jsToDBKey,
      jsKeyToProperty,
      hiddenJSKeys,
    };
  }

  protected get allSelectQuery() {
    if (this.cache.allSelectQuery) {
      return this.cache.allSelectQuery;
    }

    this.cache.allSelectQuery = Object.entries(this.dbToJSKeyMap)
      .map(([key, value]) => `"${key}" as "${value}"`)
      .join(', ');

    return this.cache.allSelectQuery;
  }

  private get hasAnyObjectAdapter() {
    if (this.cache.hasAnyObjectAdapter === undefined) {
      this.cache.hasAnyObjectAdapter =
        this.discriminators?.some((discriminator) => !!discriminator.objectAdapter) ?? !!this.objectAdapter;
    }

    return this.cache.hasAnyObjectAdapter;
  }

  // wrapper for debugging
  protected async executeQB(qb: Knex.QueryBuilder) {
    return qb;
  }

  protected propertyToObjectKey(property: EntityProperty<any>) {
    return `${property.name}${property.kind !== ReferenceKind.SCALAR ? 'ID' : ''}`;
  }

  protected onPatch(data: Record<string, any>) {
    const nextData = { ...data };

    if (!this.cache.onUpdateHandlers) {
      this.cache.onUpdateHandlers = this.entityMetadata.hydrateProps
        .filter((prop) => prop.onUpdate)
        .map((prop) => ({ field: prop.name, handler: prop.onUpdate! }));
    }

    this.cache.onUpdateHandlers.forEach(({ field, handler }) => {
      if (data[field] === undefined) {
        nextData[field] = handler(data as any);
      }
    });

    return nextData;
  }

  protected getDiscriminatorConfig(
    getValue: (data: { properties: Record<string, EntityProperty>; discriminatorColumn: string }) => unknown
  ) {
    const { properties, discriminatorColumn } = this.entityMetadata;

    const value = discriminatorColumn ? getValue({ properties, discriminatorColumn }) : null;

    if (!discriminatorColumn || !value) {
      return {
        Entity: this.Entity,
        jsKeys: Object.keys(this.jsToDBKeyMap),
        jsonAdapter: this.jsonAdapter,
        objectAdapter: this.objectAdapter,
      };
    }

    if (!this.discriminators) {
      throw new Error('discriminator is required for polymorphic entities');
    }

    if (!this.cache.discriminatorMap) {
      this.cache.discriminatorMap = Object.fromEntries(
        this.discriminators.map((discriminator) => {
          const { hydrateProps, discriminatorValue } = this.em.getMetadata().get(discriminator.Entity.name);

          if (!discriminatorValue) {
            throw new Error('discriminatorValue is required for polymorphic entities');
          }

          return [
            discriminatorValue,
            {
              Entity: discriminator.Entity,
              jsKeys: hydrateProps.map((prop) => this.propertyToObjectKey(prop)),
              jsonAdapter: discriminator.jsonAdapter,
              objectAdapter: discriminator.objectAdapter,
            },
          ];
        })
      );
    }

    const discriminator = this.cache.discriminatorMap[String(value)];

    if (!discriminator) {
      throw new Error(`discriminator value not found: ${value}`);
    }

    return discriminator;
  }

  protected getDiscriminatorConfigFromDB(value: Record<string, unknown>) {
    return this.getDiscriminatorConfig(({ properties, discriminatorColumn }) => {
      const prop = properties[discriminatorColumn];

      return value[(prop as any).fieldName ?? prop.fieldNames[0]];
    });
  }

  protected getDiscriminatorConfigToDB(value: Record<string, unknown>) {
    return this.getDiscriminatorConfig(({ discriminatorColumn }) => value[discriminatorColumn]);
  }

  protected fromDB(data: Record<string, unknown>) {
    const { jsKeys, objectAdapter } = this.getDiscriminatorConfigFromDB(data);
    const adaptedData = objectAdapter ? objectAdapter.fromDB(data as any) : data;

    return Utils.object.pick(adaptedData, jsKeys) as ToObject<DiscriminatorEntity>;
  }

  protected mapFromDB(result: Record<string, unknown>[]) {
    return this.hasAnyObjectAdapter || this.discriminators?.length
      ? result.map((item) => this.fromDB(item))
      : (result as ToObject<DiscriminatorEntity>[]);
  }

  protected valueToDB(value: unknown, property?: EntityProperty<any>, { ignoreValueTransform }: ToDBOptions = {}) {
    if (ignoreValueTransform || !property) return value;

    if (property.customType) {
      return property.customType.convertToDatabaseValue(value, this.platform, { mode: 'query-data', fromQuery: true });
    }

    return value;
  }

  protected toDB(data: Partial<DiscriminatorEntity>, { ignoreObjectAdapter, ignoreValueTransform }: ToDBOptions = {}) {
    const { objectAdapter } = this.getDiscriminatorConfigToDB(data);

    const adaptedData = objectAdapter && !ignoreObjectAdapter ? objectAdapter.toDB(data as any) : data;

    return Object.fromEntries(
      Object.entries(adaptedData)
        .filter(([key]) => !this.hiddenJSKeys.has(key))
        .map(([key, value]) => {
          const dbName = this.jsToDBKeyMap[key];
          const property = this.jsKeyToDBPropertyMap[key];

          return [dbName ?? key, this.valueToDB(value, property, { ignoreValueTransform })];
        })
    );
  }

  protected mapToDB(data: Partial<DiscriminatorEntity>[], options?: ToDBOptions) {
    return data.map((item) => this.toDB(item, options));
  }

  protected getSelect(fields?: string[]) {
    let select = this.allSelectQuery;

    if (fields?.length || this.hiddenJSKeys.size) {
      select = Object.entries(this.dbToJSKeyMap)
        .filter(([, value]) => (!fields?.length || fields.includes(value)) && !this.hiddenJSKeys.has(value))
        .map(([key, value]) => `"${key}" as "${value}"`)
        .join(', ');
    }

    return this.knex.raw(select);
  }

  protected buildReturning(qb: Knex.QueryBuilder, fields?: string[]) {
    qb.returning(this.getSelect(fields));
  }

  protected buildWhere(qb: Knex.QueryBuilder, data: WhereData<BaseEntity> | WhereData<BaseEntity>[]) {
    const mappedData = this.mapToDB(Array.isArray(data) ? (data as any[]) : [data], {
      ignoreObjectAdapter: true,
      ignoreValueTransform: true,
    });

    const whereBuilder = (item: any) => (builder: Knex.QueryBuilder<any, any>) => {
      Object.entries(item).forEach(([key, value], index) => {
        const isArray = Array.isArray(value);

        // eslint-disable-next-line no-nested-ternary
        const operator = isArray ? 'in' : value === null ? 'is' : '=';

        if (index === 0) {
          builder.where(key, operator, value as any);
        } else {
          builder.andWhere(key, operator, value as any);
        }
      });
    };

    mappedData.forEach((item, index) => {
      if (index === 0) {
        qb.where(whereBuilder(item));
      } else {
        qb.orWhere(whereBuilder(item));
      }
    });

    return !mappedData.length;
  }

  protected buildOrderBy(qb: Knex.QueryBuilder, data: OrderByData<BaseEntity>) {
    const mappedData = this.toDB(data as any, { ignoreObjectAdapter: true, ignoreValueTransform: true });

    qb.orderBy(Object.entries(mappedData).map(([key, value]) => ({ column: key, order: value as any })));
  }

  idToWhere(id: Primary<BaseEntity> | Primary<DiscriminatorEntity>) {
    return (id && typeof id === 'object' ? id : { id }) as Partial<ToObject<BaseEntity>>;
  }

  idsToWhere(ids: Primary<BaseEntity>[] | Primary<DiscriminatorEntity>[]) {
    const environmentIDs: string[] = [];

    const wheres = ids.map((item) => {
      const where: any = this.idToWhere(item);

      environmentIDs.push(where.environmentID);

      return where;
    });

    // db query performance optimization
    if (new Set(environmentIDs).size === 1 && environmentIDs[0] !== undefined) {
      return { environmentID: environmentIDs[0], id: wheres.map((item) => item.id) } as any;
    }

    return wheres;
  }

  async find(
    where: WhereData<BaseEntity> | WhereData<BaseEntity>[],
    { limit, offset, orderBy }: { limit?: number; offset?: number; orderBy?: OrderByData<BaseEntity> } = {}
  ) {
    const qb = this.qb.select(this.getSelect());

    const ignore = this.buildWhere(qb, where);

    if (ignore) {
      return [];
    }

    if (limit) {
      qb.limit(limit);
    }

    if (offset) {
      qb.offset(offset);
    }

    if (orderBy) {
      this.buildOrderBy(qb, orderBy);
    }

    return this.mapFromDB(await this.executeQB(qb));
  }

  async findOne(id: Primary<BaseEntity>) {
    const [result = null] = await this.find(this.idToWhere(id), { limit: 1 });

    return result;
  }

  async findMany(ids: Primary<BaseEntity>[]) {
    return this.find(this.idsToWhere(ids));
  }

  async findOneOrFail(id: Primary<BaseEntity>) {
    const result = await this.findOne(id);

    if (result === null) {
      throw new Error(`Entity not found: ${this.entityName}#${id}`);
    }

    return result;
  }

  async createOne(data: CreateData<DiscriminatorEntity>) {
    const [result] = await this.createMany([data]);

    return result;
  }

  protected async _insertMany(data: CreateData<DiscriminatorEntity>[], { upsert }: { upsert?: boolean } = {}) {
    if (!data.length) return [];

    const batchSize = this.em.config.get('batchSize');

    if (data.length > batchSize) {
      const batchResult: ToObject<DiscriminatorEntity>[] = [];

      for (let i = 0; i < data.length; i += batchSize) {
        const chunk = data.slice(i, i + batchSize);

        // eslint-disable-next-line no-await-in-loop
        batchResult.push(...(await this._insertMany(chunk, { upsert })));
      }

      return batchResult;
    }

    const qb = this.qb.insert(this.mapToDB(data as any));

    if (upsert) {
      qb.onConflict(this.dbPrimaryKeys).merge();
    }

    this.buildReturning(qb);

    return this.mapFromDB(await this.executeQB(qb));
  }

  async createMany(data: CreateData<DiscriminatorEntity>[]) {
    return this._insertMany(data);
  }
}
