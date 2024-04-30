import { ObjectId } from 'bson';
import type { Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import AbstractModel from '@/legacy/models/_mongo';
import config from '@/old_config';

const collectionName = 'test-collection';

class TestModel extends AbstractModel<any, any, string> {
  READ_ONLY_KEYS = [];

  public collectionName = collectionName;
}

describe('mongo model integrations tests', () => {
  let client: MongoClient;
  let db: Db;
  let model: TestModel;

  beforeAll(async () => {
    client = await MongoClient.connect(config.MONGO_URI);
    db = client.db(config.MONGO_DB);
    model = new TestModel(null as any, { clients: { mongo: { db } } } as any);

    await model.setup();
  });

  beforeEach(async () => {
    await db.collection(collectionName).deleteMany({});
  });

  afterAll(async () => {
    await client.close();
  });

  it('insertOne', async () => {
    const obj = { foo: 'bar' };
    const { _id } = await model.insertOne(obj);

    const result = await db.collection(collectionName).findOne({ _id: new ObjectId(_id) });

    expect(result).to.eql({ _id, ...obj });
  });

  it('insertMany', async () => {
    const data = [{ foo1: 'bar1' }, { foo2: 'bar2' }];

    const [{ _id: id1 }, { _id: id2 }] = await model.insertMany(data);

    const obj1 = await db.collection(collectionName).findOne({ _id: new ObjectId(id1) });
    const obj2 = await db.collection(collectionName).findOne({ _id: new ObjectId(id2) });

    expect([obj1, obj2]).to.eql([
      { _id: id1, ...data[0] },
      { _id: id2, ...data[1] },
    ]);
  });

  it('updateOne', async () => {
    const result = (await db.collection(collectionName).insertOne({ foo: 'bar' })).ops[0];
    await model.updateOne({ _id: new ObjectId(result._id) }, { foo: 'bar2' });

    const updatedResult = await db.collection(collectionName).findOne({ _id: new ObjectId(result._id) });

    expect(updatedResult).to.eql({ _id: result._id, foo: 'bar2' });
  });

  it('findMany', async () => {
    await db.collection(collectionName).insertMany([{ foo: true }, { foo: false }, { foo: true }]);

    expect((await model.findMany({ foo: true })).length).to.eql(2);
  });

  it('findOne', async () => {
    const result = (await db.collection(collectionName).insertOne({ foo: 'bar' })).ops[0];

    const found = await model.findOne({ foo: 'bar' });

    expect(result).to.eql(found);
  });

  it('deleteOne', async () => {
    await db.collection(collectionName).insertMany([{ foo: true }, { foo: false }, { foo: true }]);

    await model.deleteOne({ foo: false });

    expect((await db.collection(collectionName).find({}).toArray()).length).to.eql(2);
  });
});
