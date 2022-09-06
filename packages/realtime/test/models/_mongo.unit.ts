import { ObjectId } from 'bson';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import _ from 'lodash';
import sinon from 'sinon';

import AbstractModel from '@/models/_mongo';

chai.use(chaiAsPromised);
const { expect } = chai;

class TestModel extends AbstractModel<any, any, string> {
  public collectionName = 'test-collection';

  modifyCollection = sinon.stub();
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

      expect(model.collection).to.eql(collection);
    });

    it('not set', () => {
      const model = new TestModel(null as any, {} as any);

      expect(() => model.collection).to.throws('Collection is undefined. init model first');
    });
  });

  describe('init', () => {
    it('collection gets set correctly', async () => {
      const collection = { foo: _.noop };
      const db = {
        collection: sinon.stub().returns(collection),
        listCollections: sinon.stub().returns({ hasNext: sinon.stub().resolves(false) }),
        createCollection: sinon.stub(),
      };
      const model = new TestModel(null as any, { clients: { mongo: { db } } } as any);

      await model.setup();

      expect(model.collection).to.eql(collection);
    });
  });

  describe('insertOne', () => {
    it('throws', async () => {
      const collection = { insertOne: sinon.stub().resolves({ result: { ok: 0 } }) };
      const model = generateModel(collection);
      const data = { foo: 'bar' };

      await expect(model.insertOne(data)).to.eventually.rejectedWith('insert one error');

      expect(collection.insertOne.args).to.eql([[data]]);
    });

    it('passes', async () => {
      const result = { _id: '123' };
      const collection = { insertOne: sinon.stub().resolves({ insertedCount: 1, result: { ok: 1 }, ops: [result] }) };
      const model = generateModel(collection);
      const data = { foo: 'bar' };

      expect(await model.insertOne(data)).to.eql(result);

      expect(collection.insertOne.args).to.eql([[data]]);
    });
  });

  describe('insertMany', () => {
    it('throws', async () => {
      const collection = { insertMany: sinon.stub().resolves({ result: { ok: 0 } }) };
      const model = generateModel(collection);
      const data = [{ foo: 'bar' }, { foo1: 'bar1' }];

      await expect(model.insertMany(data)).to.eventually.rejectedWith('insert many error');

      expect(collection.insertMany.args).to.eql([[data]]);
    });

    it('passes', async () => {
      const result = [{ _id: '123' }, { _id: '456' }];
      const collection = { insertMany: sinon.stub().resolves({ insertedCount: 2, result: { ok: 1 }, ops: result }) };
      const model = generateModel(collection);
      const data = [{ foo: 'bar' }, { foo1: 'bar1' }];

      expect(await model.insertMany(data)).to.eql(result);

      expect(collection.insertMany.args).to.eql([[data]]);
    });
  });

  describe('updateOne', () => {
    it('throws', async () => {
      const collection = { updateOne: sinon.stub().resolves({ result: { ok: 0 } }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };
      const data = { foo2: 'bar2' };

      await expect(model.updateOne(filter, data)).to.eventually.rejectedWith('update error');

      expect(collection.updateOne.args).to.eql([[filter, { $set: data }, { arrayFilters: [] }]]);
    });

    it('passes', async () => {
      const collection = { updateOne: sinon.stub().resolves({ matchedCount: 1, result: { ok: 1 } }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };
      const data = { foo2: 'bar2' };

      expect(await model.updateOne(filter, data)).to.eql(data);

      expect(collection.updateOne.args).to.eql([[filter, { $set: data }, { arrayFilters: [] }]]);
    });

    it('passes upsert', async () => {
      const collection = { updateOne: sinon.stub().resolves({ modifiedCount: 0, result: { ok: 1 } }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };
      const data = { foo2: 'bar2' };

      expect(await model.updateOne(filter, data, '$set', { upsert: true })).to.eql(data);

      expect(collection.updateOne.args).to.eql([[filter, { $set: data }, { upsert: true, arrayFilters: [] }]]);
    });
  });

  it('findMany', async () => {
    const resultData = [{ _id: '1' }, { _id: '2' }];
    const toArray = sinon.stub().returns(resultData);
    const collection = { find: sinon.stub().returns({ toArray }) };
    const model = generateModel(collection);
    const filter = { foo: 'bar' };

    expect(await model.findMany(filter)).to.eql(resultData);

    expect(collection.find.args).to.eql([[filter, undefined]]);
  });

  it('findOne', async () => {
    const resultData = [{ _id: '1' }, { _id: '2' }];
    const collection = { findOne: sinon.stub().resolves(resultData) };
    const model = generateModel(collection);
    const filter = { foo: 'bar' };

    expect(await model.findOne(filter)).to.eql(resultData);

    expect(collection.findOne.args).to.eql([[filter, undefined]]);
  });

  describe('deleteOne', () => {
    it('throws', async () => {
      const collection = { deleteOne: sinon.stub().resolves({ result: { ok: 0 } }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };

      await expect(model.deleteOne(filter)).to.eventually.rejectedWith('delete error');

      expect(collection.deleteOne.args).to.eql([[filter]]);
    });

    it('passes', async () => {
      const collection = { deleteOne: sinon.stub().resolves({ deletedCount: 1, result: { ok: 1 } }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };

      await model.deleteOne(filter);

      expect(collection.deleteOne.args).to.eql([[filter]]);
    });

    it('passes silent', async () => {
      const collection = { deleteOne: sinon.stub().resolves({ result: { ok: 0 } }) };
      const model = generateModel(collection);
      const filter = { foo: 'bar' };

      await model.deleteOne(filter, { silent: true });

      expect(collection.deleteOne.args).to.eql([[filter]]);
    });
  });

  it('findByID', async () => {
    const result = { _id: '5ec7e2005f68a44b5a68e5a4', foo: 'bar' };
    const model = generateModel();
    const stubFindOne = sinon.stub().resolves(result);
    model.findOne = stubFindOne;

    expect(await model.findByID(result._id)).to.eql(result);

    expect(stubFindOne.args).to.eql([[{ _id: new ObjectId(result._id) }, undefined]]);
  });

  it('updateByID', async () => {
    const id = '5ec7e2005f68a44b5a68e5a4';
    const data = { foo: 'bar' };
    const model = generateModel();
    const stubUpdateOne = sinon.stub().returns(data);
    model.updateOne = stubUpdateOne;

    expect(await model.updateByID(id, data)).to.eql(data);

    expect(stubUpdateOne.args).to.eql([[{ _id: new ObjectId(id) }, data, undefined]]);
  });

  it('deleteByID', async () => {
    const id = '5ec7e2005f68a44b5a68e5a4';
    const model = generateModel();
    const stubDeleteOne = sinon.stub();
    model.deleteOne = stubDeleteOne;

    expect(await model.deleteByID(id)).to.eql(id);

    expect(stubDeleteOne.args).to.eql([[{ _id: new ObjectId(id) }]]);
  });

  describe('_projection', () => {
    it('no fields', () => {
      // eslint-disable-next-line dot-notation
      expect(AbstractModel['projection']()).to.eql(undefined);
    });

    it('with fields', () => {
      // eslint-disable-next-line dot-notation
      expect(AbstractModel['projection'](['field1', 'field2'])).to.eql({ projection: { field1: true, field2: true } });
    });
  });
});
