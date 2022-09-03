import type { LoguxControl } from '@voiceflow/socket-utils';
import { ObjectId } from 'bson';
import _ from 'lodash';
import { Collection, FilterQuery, FindOneAndUpdateOption, OptionalId, UpdateOneOptions, UpdateQuery, WithId } from 'mongodb';

import { Config } from '@/types';

import type { ClientMap } from '../clients';
import { Atomic } from './utils';

export interface ModelDependencies {
  clients: ClientMap;
}

abstract class MongoModel<T> implements LoguxControl {
  protected static getAtomicUpdatesFields<M>(updates: Atomic.UpdateOperation<any>[]) {
    return updates.reduce(
      (acc, update) => ({
        query: { ...acc.query, [update.operation]: { ...acc.query[update.operation as keyof UpdateQuery<M>], ...update.query } },
        arrayFilters: [...acc.arrayFilters, ...update.arrayFilters],
      }),
      { query: {} as UpdateQuery<M>, arrayFilters: [] as object[] }
    );
  }

  // generate find options with a projection based on the fields
  protected static projection(fields?: string[]) {
    if (!fields?.length) return undefined;

    return {
      projection: Object.fromEntries(fields.map((field) => [field, true])),
    };
  }

  public clients: ClientMap;

  constructor(public config: Config, { clients }: ModelDependencies) {
    this.clients = clients;
  }

  public abstract collectionName: string;

  protected _collection: Collection<T> | undefined;

  get collection() {
    if (!this._collection) throw new Error('Collection is undefined. init model first');

    return this._collection;
  }

  setup(): void {
    this._collection = this.clients.mongo.db.collection(this.collectionName);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  destroy(): void {}

  async insertOne(data: OptionalId<T>): Promise<WithId<T>> {
    const {
      insertedCount,
      result: { ok },
      ops,
    } = await this.collection.insertOne(data);
    if (!ok || insertedCount !== 1) throw Error('insert one error');
    return ops[0];
  }

  async insertMany(data: OptionalId<T>[]): Promise<WithId<T>[]> {
    const {
      insertedCount,
      result: { ok },
      ops,
    } = await this.collection.insertMany(data);
    if (!ok || insertedCount !== data.length) throw Error('insert many error');
    return ops;
  }

  async atomicUpdateOne(filter: FilterQuery<T>, updates: Atomic.UpdateOperation<any>[], options?: UpdateOneOptions) {
    const { query, arrayFilters } = MongoModel.getAtomicUpdatesFields<T>(updates);

    const {
      matchedCount,
      result: { ok },
    } = await this.collection.updateOne(filter, query, { ...options, arrayFilters: [...arrayFilters, ...(options?.arrayFilters ?? [])] });

    if (!ok) {
      throw Error('update error');
    }

    if (matchedCount !== 1 && !options?.upsert) {
      throw Error("couldn't find entity or passed value is same");
    }
  }

  async updateOne(filter: FilterQuery<T>, data: Partial<T>, operation?: Atomic.UpdateOperationType, options?: UpdateOneOptions) {
    await this.atomicUpdateOne(filter, [{ operation: operation ?? '$set', query: data, arrayFilters: [] }], options);

    return data;
  }

  async findOneAndAtomicUpdate(filter: FilterQuery<T>, updates: Atomic.UpdateOperation<any>[], options?: UpdateOneOptions): Promise<T> {
    const { query, arrayFilters } = MongoModel.getAtomicUpdatesFields<T>(updates);

    const { value, ok } = await this.collection.findOneAndUpdate(filter, query, {
      ...options,
      arrayFilters: [...arrayFilters, ...(options?.arrayFilters ?? [])],
    });

    if (!ok) {
      throw Error('update error');
    }

    if (!value) {
      throw Error("couldn't find entity");
    }

    return value;
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    data: Partial<T>,
    operation: Atomic.UpdateOperationType,
    options?: FindOneAndUpdateOption
  ): Promise<T> {
    return this.findOneAndAtomicUpdate(filter, [{ operation: operation ?? '$set', query: data, arrayFilters: [] }], options);
  }

  async findMany(filter: FilterQuery<T>, fields?: string[]): Promise<Array<T>> {
    return this.collection.find(filter, MongoModel.projection(fields)).toArray();
  }

  async findManyAndSort(filter: FilterQuery<T>, sortProperty: string, fields?: string[]): Promise<Array<T>> {
    return this.collection.find(filter, MongoModel.projection(fields)).sort(sortProperty).toArray();
  }

  async findOne(filter: FilterQuery<T>, fields?: string[]): Promise<T | null> {
    return this.collection.findOne(filter, MongoModel.projection(fields));
  }

  async deleteOne(filter: FilterQuery<T>, { silent }: { silent?: boolean } = {}) {
    const {
      deletedCount,
      result: { ok },
    } = await this.collection.deleteOne(filter);

    if (!silent && (!ok || deletedCount !== 1)) throw Error('delete error');
  }

  async deleteMany(filter: FilterQuery<T>, { silent }: { silent?: boolean } = {}) {
    const {
      result: { ok },
    } = await this.collection.deleteMany(filter);

    if (!silent && !ok) throw Error('delete many error');
  }

  // type assertion
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/39358
  public idFilter = (id: string) => ({ _id: new ObjectId(id) } as FilterQuery<T>);

  // TODO not sure if this works
  public idsFilter = (ids: string[]) => ({ _id: { $in: ids.map((x) => new ObjectId(x)) } } as unknown as FilterQuery<T>);

  async findById(id: string): Promise<T>;

  async findById<K extends keyof T>(id: string, fields: Array<K>): Promise<Pick<T, K>>;

  async findById(id: string, fields?: Array<string>): Promise<Partial<T>>;

  async findById(id: string, fields?: Array<string>) {
    const result = await this.findOne(this.idFilter(id), fields);

    if (!result) throw Error('not found');

    return result;
  }

  async findManyByIds(ids: string[]): Promise<Array<T>>;

  async findManyByIds(ids: string[]): Promise<Array<Partial<T>>>;

  async findManyByIds(ids: string[]) {
    return this.collection.find(this.idsFilter(ids)).toArray();
  }

  async updateById(id: string, data: Partial<T>, operation?: Atomic.UpdateOperationType) {
    return this.updateOne(this.idFilter(id), data, operation);
  }

  async atomicUpdateById(id: string, updates: Atomic.UpdateOperation<any>[], options?: UpdateOneOptions) {
    return this.atomicUpdateOne(this.idFilter(id), updates, options);
  }

  async findAndAtomicUpdateById(id: string, updates: Atomic.UpdateOperation<any>[], options?: UpdateOneOptions) {
    return this.findOneAndAtomicUpdate(this.idFilter(id), updates, options);
  }

  async deleteById(id: string) {
    await this.deleteOne(this.idFilter(id));
    return id;
  }

  async deleteManyByIDs(ids: string[]) {
    return this.deleteMany(this.idsFilter(ids));
  }
}

export default MongoModel;
