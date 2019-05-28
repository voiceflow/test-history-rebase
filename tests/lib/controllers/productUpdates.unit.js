'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');

const ProductUpdates = require('../../../lib/controllers/productUpdates');

describe('product update controller unit tests', () => {
  beforeEach(() => sinon.restore());

  it('get updates', async () => {
    const services = {
      productManager: {
        getUpdates: sinon.stub().resolves([]),
      },
    };

    const productUpdates = new ProductUpdates(services);

    const req = {};
    const res = sinon.stub().returns();
    const next = sinon.stub().returns();

    expect(await productUpdates.getUpdates(req, res, next)).to.eql([]);
    expect(res.callCount).to.eql(0);
    expect(next.callCount).to.eql(0);

    expect(services.productManager.getUpdates.callCount).to.eql(1);
  });

  it('create updates', async () => {
    const services = {
      productManager: {
        createUpdate: sinon.stub().resolves(),
      },
    };

    const productUpdates = new ProductUpdates(services);

    const req = {
      body: {
        type: 'a',
        details: 'b',
      },
    };
    const res = sinon.stub().returns();
    const next = sinon.stub().returns();

    expect(await productUpdates.createUpdate(req, res, next)).to.eql();
    expect(res.callCount).to.eql(0);
    expect(next.callCount).to.eql(0);

    expect(services.productManager.createUpdate.args[0][0]).to.eql('a');
    expect(services.productManager.createUpdate.args[0][1]).to.eql('b');
  });
});
