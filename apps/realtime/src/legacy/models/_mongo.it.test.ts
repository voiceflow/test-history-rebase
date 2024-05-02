import createMultiAdapter from 'bidirectional-adapter';
import { ObjectId } from 'bson';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import AbstractModel from './_mongo';
import { MongoDB } from './_suite';

const collectionName = 'test-collection';

class TestModel extends AbstractModel<any, any, string> {
  READ_ONLY_KEYS = [];

  public collectionName = collectionName;

  adapter = createMultiAdapter(vi.fn(), vi.fn());
}

describe('mongo model integrations tests', () => {
  let mongo: MongoDB;
  let model: TestModel;

  beforeAll(async () => {
    mongo = await MongoDB();

    model = new TestModel(null as any, { clients: { mongo } } as any);
    model.setup();
  }, 30000);

  beforeEach(async () => {
    await mongo.db.collection(collectionName).deleteMany({});
  });

  afterAll(async () => {
    await mongo.stop();
  });

  it('insertOne', async () => {
    const obj = { foo: 'bar' };

    const { _id } = await model.insertOne(obj);

    const result = await mongo.db.collection(collectionName).findOne({ _id: new ObjectId(_id) });
    expect(result).toEqual({ _id, ...obj });
  });

  it('insertMany', async () => {
    const data = [{ foo1: 'bar1' }, { foo2: 'bar2' }];

    const [{ _id: id1 }, { _id: id2 }] = await model.insertMany(data);

    const obj1 = await mongo.db.collection(collectionName).findOne({ _id: new ObjectId(id1) });
    const obj2 = await mongo.db.collection(collectionName).findOne({ _id: new ObjectId(id2) });

    expect([obj1, obj2]).toEqual([
      { _id: id1, ...data[0] },
      { _id: id2, ...data[1] },
    ]);
  });

  it('updateOne', async () => {
    const result = await mongo.db.collection(collectionName).insertOne({ foo: 'bar' });
    await model.updateOne({ _id: result.insertedId }, { foo: 'bar2' } as any);

    const updatedResult = await mongo.db.collection(collectionName).findOne({ _id: result.insertedId });

    expect(updatedResult).toEqual({ _id: result.insertedId, foo: 'bar2' });
  });

  it('findMany', async () => {
    await mongo.db.collection(collectionName).insertMany([{ foo: true }, { foo: false }, { foo: true }]);

    expect((await model.findMany({ foo: true })).length).toBe(2);
  });

  it('findOne', async () => {
    const result = await mongo.db.collection(collectionName).insertOne({ foo: 'bar' });

    const found = await model.findOne({ foo: 'bar' });

    expect(result.insertedId).toEqual(found._id);
  });

  it('deleteOne', async () => {
    await mongo.db.collection(collectionName).insertMany([{ foo: true }, { foo: false }, { foo: true }]);

    await model.deleteOne({ foo: false });

    expect((await mongo.db.collection(collectionName).find({}).toArray()).length).toBe(2);
  });
});
