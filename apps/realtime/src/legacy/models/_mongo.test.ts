/* eslint-disable dot-notation */
import { createMultiAdapter } from 'bidirectional-adapter';
import { ObjectId } from 'bson';
import _ from 'lodash';
import { describe, expect, it, vi } from 'vitest';

import AbstractModel from '@/legacy/models/_mongo';

class TestModel extends AbstractModel<any, any, string> {
  READ_ONLY_KEYS = [];

  public collectionName = 'test-collection';

  modifyCollection = vi.fn();

  adapter = createMultiAdapter(vi.fn(), vi.fn());
}

describe('mongo model unit tests', () => {
  const generateModel = (collection = {}) => {
    const model = new TestModel(null as any, { clients: { mongo: { db: {} } } } as any);
    _.set(model, '_collection', collection);
    return model;
  };

  describe('collection', () => {
    it('set', () => {
      const model = new TestModel(null as any, {} as any);
      const collection = { foo: _.noop };
      _.set(model, '_collection', collection);

      expect(model['collection']).toEqual(collection);
    });

    it('not set', () => {
      const model = new TestModel(null as any, {} as any);

      expect(() => model['collection']).toThrow('Collection is undefined. init model first');
    });
  });

  describe('init', () => {
    it('collection gets set correctly', async () => {
      const collection = { foo: _.noop };
      const db = {
        collection: vi.fn().mockReturnValue(collection),
        listCollections: vi.fn().mockReturnValue({ hasNext: vi.fn().mockResolvedValue(false) }),
        createCollection: vi.fn(),
      };
      const model = new TestModel(null as any, { clients: { mongo: { db } } } as any);

      await model.setup();

      expect(model['collection']).toEqual(collection);
    });
  });

  describe('insertOne', () => {
    it('throws', async () => {
      const collection = { insertOne: vi.fn().mockResolvedValue({ acknowledged: 0 }) };
      const model = generateModel(collection);
      const data = { foo: 'bar' };

      await expect(model.insertOne(data)).rejects.toThrow('insert one error');

      expect(collection.insertOne.mock.calls).toEqual([[data]]);
    });

    it('passes', async () => {
      const collection = { insertOne: vi.fn().mockResolvedValue({ insertedCount: 1, acknowledged: 1 }) };
      const model = generateModel(collection);
      const data = { foo: 'bar' };

      await model.insertOne(data);

      expect(collection.insertOne.mock.calls).toEqual([[data]]);
    });
  });

  describe('insertMany', () => {
    it('throws', async () => {
      const collection = { insertMany: vi.fn().mockResolvedValue({ acknowledged: 0 }) };
      const model = generateModel(collection);
      const data = [{ foo: 'bar' }, { foo1: 'bar1' }];

      await expect(model.insertMany(data)).rejects.toThrow('insert many error');

      expect(collection.insertMany.mock.calls).toEqual([[data]]);
    });

    it('passes', async () => {
      const collection = { insertMany: vi.fn().mockResolvedValue({ insertedCount: 2, acknowledged: 1 }) };
      const model = generateModel(collection);
      const data = [{ foo: 'bar' }, { foo1: 'bar1' }];

      await model.insertMany(data);

      expect(collection.insertMany.mock.calls).toEqual([[data]]);
    });
  });

  describe('updateOne', () => {
    it('throws', async () => {
      const collection = { updateOne: vi.fn().mockResolvedValue({ acknowledged: 0 }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };
      const data = { foo2: 'bar2' };

      await expect(model.updateOne(filter, data)).rejects.toThrow('update error');

      expect(collection.updateOne.mock.calls).toEqual([[filter, { $set: data }, { arrayFilters: [] }]]);
    });

    it('passes', async () => {
      const collection = { updateOne: vi.fn().mockResolvedValue({ matchedCount: 1, acknowledged: 1 }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };
      const data = { foo2: 'bar2' };

      expect(await model.updateOne(filter, data)).toEqual(data);

      expect(collection.updateOne.mock.calls).toEqual([[filter, { $set: data }, { arrayFilters: [] }]]);
    });

    it('passes upsert', async () => {
      const collection = { updateOne: vi.fn().mockResolvedValue({ modifiedCount: 0, acknowledged: 1 }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };
      const data = { foo2: 'bar2' };

      expect(await model.updateOne(filter, data, '$set', { upsert: true })).toEqual(data);

      expect(collection.updateOne.mock.calls).toEqual([[filter, { $set: data }, { upsert: true, arrayFilters: [] }]]);
    });
  });

  it('findMany', async () => {
    const resultData = [{ _id: '1' }, { _id: '2' }];
    const toArray = vi.fn().mockReturnValue(resultData);
    const collection = { find: vi.fn().mockReturnValue({ toArray }) };
    const model = generateModel(collection);
    const filter = { foo: 'bar' };

    expect(await model.findMany(filter)).toEqual(resultData);

    expect(collection.find.mock.calls).toEqual([[filter, undefined]]);
  });

  it('findOne', async () => {
    const resultData = [{ _id: '1' }, { _id: '2' }];
    const collection = { findOne: vi.fn().mockResolvedValue(resultData) };
    const model = generateModel(collection);
    const filter = { foo: 'bar' };

    expect(await model.findOne(filter)).toEqual(resultData);

    expect(collection.findOne.mock.calls).toEqual([[filter, undefined]]);
  });

  describe('deleteOne', () => {
    it('throws', async () => {
      const collection = { deleteOne: vi.fn().mockResolvedValue({ acknowledged: 0 }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };

      await expect(model.deleteOne(filter)).rejects.toThrow('delete error');

      expect(collection.deleteOne.mock.calls).toEqual([[filter]]);
    });

    it('passes', async () => {
      const collection = { deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1, acknowledged: 1 }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };

      await model.deleteOne(filter);

      expect(collection.deleteOne.mock.calls).toEqual([[filter]]);
    });

    it('passes silent', async () => {
      const collection = { deleteOne: vi.fn().mockResolvedValue({ acknowledged: 0 }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };

      await model.deleteOne(filter, { silent: true });

      expect(collection.deleteOne.mock.calls).toEqual([[filter]]);
    });
  });

  it('findByID', async () => {
    const result = { _id: '5ec7e2005f68a44b5a68e5a4', foo: 'bar' };
    const model = generateModel();
    const stubFindOne = vi.fn().mockResolvedValue(result);
    model.findOne = stubFindOne;

    expect(await model.findByID(result._id)).toEqual(result);

    expect(stubFindOne.mock.calls).toEqual([[{ _id: new ObjectId(result._id) }, undefined]]);
  });

  it('updateByID', async () => {
    const id = '5ec7e2005f68a44b5a68e5a4';
    const data = { foo: 'bar' };
    const model = generateModel();
    const stubUpdateOne = vi.fn().mockReturnValue(data);
    model.updateOne = stubUpdateOne;

    expect(await model.updateByID(id, data)).toEqual(data);

    expect(stubUpdateOne.mock.calls).toEqual([[{ _id: new ObjectId(id) }, data, undefined]]);
  });

  it('deleteByID', async () => {
    const id = '5ec7e2005f68a44b5a68e5a4';
    const model = generateModel();
    const stubDeleteOne = vi.fn();
    model.deleteOne = stubDeleteOne;

    expect(await model.deleteByID(id)).toEqual(id);

    expect(stubDeleteOne.mock.calls).toEqual([[{ _id: new ObjectId(id) }]]);
  });

  describe('_projection', () => {
    it('no fields', () => {
      expect(AbstractModel['projection']()).toEqual(undefined);
    });

    it('with fields', () => {
      expect(AbstractModel['projection'](['field1', 'field2'])).toEqual({ projection: { field1: true, field2: true } });
    });
  });
});
