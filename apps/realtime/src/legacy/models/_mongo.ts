// eslint-disable-next-line max-classes-per-file
import type { EmptyObject } from '@voiceflow/common';
import type { LoguxControl } from '@voiceflow/socket-utils';
import { SmartMultiAdapter } from 'bidirectional-adapter';
import { ObjectId } from 'bson';
import { Collection, Filter, FindOneAndUpdateOptions, OptionalUnlessRequiredId, Sort, UpdateFilter, UpdateOptions, WithId } from 'mongodb';

import { Config } from '@/types';

import type { ClientMap } from '../clients';
import { Atomic } from './utils';

export interface ModelDependencies {
  clients: ClientMap;
}

export interface FromDB<DBModel, Model> {
  (diagram: DBModel): Model;

  <PartialDBModel extends Partial<DBModel>>(diagram: PartialDBModel): Pick<Model, Extract<keyof Model, keyof PartialDBModel>>;
}

abstract class MongoModel<DBModel extends Document, Model extends EmptyObject, ReadOnlyKeys extends string> implements LoguxControl {
  abstract READ_ONLY_KEYS: ReadonlyArray<ReadOnlyKeys>;

  protected static getAtomicUpdatesFields<M>(updates: Atomic.UpdateOperation<any>[]) {
    return updates.reduce(
      (acc, update) => ({
        query: {
          ...acc.query,
          [update.operation]: {
            ...acc.query[update.operation as keyof UpdateFilter<M>],
            ...update.query,
          },
        },
        arrayFilters: [...acc.arrayFilters, ...update.arrayFilters],
      }),
      { query: {} as UpdateFilter<M>, arrayFilters: [] as object[] }
    );
  }

  // generate find options with a projection based on the fields
  protected static projection<Key extends keyof any>(fields?: Key[]) {
    if (!fields?.length) return undefined;

    return {
      projection: Object.fromEntries(fields.map((field) => [field, true])),
    };
  }

  public clients: ClientMap;

  abstract adapter: SmartMultiAdapter<DBModel, Model>;

  constructor(public config: Config, { clients }: ModelDependencies) {
    this.clients = clients;
  }

  public abstract collectionName: string;

  protected _collection: Collection<DBModel> | undefined;

  protected get collection() {
    if (!this._collection) {
      throw new Error('Collection is undefined. init model first');
    }

    return this._collection;
  }

  setup(): void {
    this._collection = this.clients.mongo.db.collection(this.collectionName);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  destroy(): void {}

  // type assertion
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/39358
  idFilter = (id: string) => ({ _id: new ObjectId(id) } as Filter<DBModel>);

  // TODO not sure if this works
  idsFilter = (ids: string[]) =>
    ({
      _id: { $in: ids.map((x) => new ObjectId(x)) },
    } as unknown as Filter<DBModel>);

  generateObjectID(): ObjectId {
    return new ObjectId();
  }

  generateObjectIDString(): string {
    return this.generateObjectID().toHexString();
  }

  async insertOne(data: OptionalUnlessRequiredId<DBModel>): Promise<WithId<DBModel>> {
    const { insertedCount, acknowledged, ops } = await this.collection.insertOne(data);

    if (!acknowledged || insertedCount !== 1) throw new Error('insert one error');

    return ops[0];
  }

  async insertMany(data: OptionalUnlessRequiredId<DBModel>[]): Promise<WithId<DBModel>[]> {
    const { insertedCount, acknowledged, ops } = await this.collection.insertMany(data);
    if (!acknowledged || insertedCount !== data.length) {
      throw new Error('insert many error');
    }
    return ops;
  }

  async atomicUpdateOne(filter: Filter<DBModel>, updates: Atomic.UpdateOperation<any>[], options?: UpdateOptions): Promise<void> {
    const { query, arrayFilters } = MongoModel.getAtomicUpdatesFields<DBModel>(updates);

    const { matchedCount, acknowledged } = await this.collection.updateOne(filter, query, {
      ...options,
      arrayFilters: [...arrayFilters, ...(options?.arrayFilters ?? [])],
    });

    if (!acknowledged) {
      throw new Error('update error');
    }

    if (matchedCount !== 1 && !options?.upsert) {
      throw new Error("couldn't find entity or passed value is same");
    }
  }

  async updateOne(
    filter: Filter<DBModel>,
    data: Partial<Omit<DBModel, ReadOnlyKeys>>,
    operation?: Atomic.UpdateOperationType,
    options?: UpdateOptions
  ): Promise<Partial<Omit<DBModel, ReadOnlyKeys>>> {
    await this.atomicUpdateOne(
      filter,
      [
        {
          operation: operation ?? '$set',
          query: data,
          arrayFilters: [],
        },
      ],
      options
    );

    return data;
  }

  async findOneAndAtomicUpdate(filter: Filter<DBModel>, updates: Atomic.UpdateOperation<any>[], options?: UpdateOptions): Promise<DBModel> {
    const { query, arrayFilters } = MongoModel.getAtomicUpdatesFields<DBModel>(updates);

    const { value, ok } = await this.collection.findOneAndUpdate(filter, query, {
      ...options,
      arrayFilters: [...arrayFilters, ...(options?.arrayFilters ?? [])],
    });

    if (!ok) {
      throw new Error('update error');
    }

    if (!value) {
      throw new Error("couldn't find entity");
    }

    return value;
  }

  async findOneAndUpdate(
    filter: Filter<DBModel>,
    data: Partial<DBModel>,
    operation: Atomic.UpdateOperationType,
    options?: FindOneAndUpdateOptions
  ): Promise<DBModel> {
    return this.findOneAndAtomicUpdate(
      filter,
      [
        {
          operation: operation ?? '$set',
          query: data,
          arrayFilters: [],
        },
      ],
      options
    );
  }

  async findMany(filter: Filter<DBModel>): Promise<DBModel[]>;

  async findMany<Key extends keyof DBModel>(filter: Filter<DBModel>, fields: Key[]): Promise<Pick<DBModel, Key>[]>;

  async findMany(filter: Filter<DBModel>, fields?: (keyof DBModel)[]): Promise<Partial<DBModel>[]>;

  async findMany(filter: Filter<DBModel>, fields?: (keyof DBModel)[]): Promise<Partial<DBModel>[]> {
    return this.collection.find(filter, MongoModel.projection(fields)).toArray();
  }

  async findManyAndSort(filter: Filter<DBModel>, sortProperty: Sort): Promise<DBModel[]>;

  async findManyAndSort<Key extends keyof DBModel>(filter: Filter<DBModel>, sortProperty: Sort, fields: Key[]): Promise<Pick<DBModel, Key>[]>;

  async findManyAndSort(filter: Filter<DBModel>, sortProperty: Sort, fields?: (keyof DBModel)[]): Promise<Partial<DBModel>[]>;

  async findManyAndSort(filter: Filter<DBModel>, sortProperty: Sort, fields?: (keyof DBModel)[]): Promise<Partial<DBModel>[]> {
    return this.collection.find(filter, MongoModel.projection(fields)).sort(sortProperty).toArray();
  }

  async findOne(filter: Filter<DBModel>): Promise<DBModel | null>;

  async findOne<Key extends keyof DBModel>(filter: Filter<DBModel>, fields: Key[]): Promise<Pick<DBModel, Key> | null>;

  async findOne(filter: Filter<DBModel>, fields?: (keyof DBModel)[]): Promise<Partial<DBModel> | null>;

  async findOne(filter: Filter<DBModel>, fields?: (keyof DBModel)[]): Promise<Partial<DBModel> | null> {
    return this.collection.findOne(filter, MongoModel.projection(fields));
  }

  async deleteOne(filter: Filter<DBModel>, { silent }: { silent?: boolean } = {}) {
    const { deletedCount, acknowledged } = await this.collection.deleteOne(filter);

    if (!silent && (!acknowledged || deletedCount !== 1)) throw new Error('delete error');
  }

  async deleteMany(filter: Filter<DBModel>, { silent }: { silent?: boolean } = {}) {
    const { acknowledged } = await this.collection.deleteMany(filter);

    if (!silent && !acknowledged) throw Error('delete many error');
  }

  async findByID(id: string): Promise<DBModel>;

  async findByID<Key extends keyof DBModel>(id: string, fields: Key[]): Promise<Pick<DBModel, Key>>;

  async findByID(id: string, fields?: (keyof DBModel)[]): Promise<Partial<DBModel>>;

  async findByID(id: string, fields?: (keyof DBModel)[]): Promise<Partial<DBModel>> {
    const result = await this.findOne(this.idFilter(id), fields!);

    if (!result) throw new Error('not found');

    return result;
  }

  async findManyByIDs(ids: string[]): Promise<DBModel[]>;

  async findManyByIDs<Key extends keyof DBModel>(ids: string[], fields: Key[]): Promise<Pick<DBModel, Key>[]>;

  async findManyByIDs(ids: string[], fields?: (keyof DBModel)[]): Promise<Partial<DBModel>[]>;

  async findManyByIDs(ids: string[], fields?: (keyof DBModel)[]): Promise<Partial<DBModel>[]> {
    return this.collection.find(this.idsFilter(ids), MongoModel.projection(fields)).toArray();
  }

  async updateByID(
    id: string,
    data: Partial<Omit<DBModel, ReadOnlyKeys>>,
    operation?: Atomic.UpdateOperationType
  ): Promise<Partial<Omit<DBModel, ReadOnlyKeys>>> {
    return this.updateOne(this.idFilter(id), data, operation);
  }

  async atomicUpdateByID(id: string, updates: Atomic.UpdateOperation<any>[], options?: UpdateOptions): Promise<void> {
    return this.atomicUpdateOne(this.idFilter(id), updates, options);
  }

  async findAndAtomicUpdateByID(id: string, updates: Atomic.UpdateOperation<any>[], options?: UpdateOptions): Promise<DBModel> {
    return this.findOneAndAtomicUpdate(this.idFilter(id), updates, options);
  }

  async deleteByID(id: string): Promise<string> {
    await this.deleteOne(this.idFilter(id));

    return id;
  }

  async deleteManyByIDs(ids: string[]): Promise<void> {
    return this.deleteMany(this.idsFilter(ids));
  }
}

export abstract class NestedMongoModel<Model extends MongoModel<any, any, any>> {
  abstract readonly MODEL_PATH: string;

  constructor(protected model: Model) {}
}

export default MongoModel;
