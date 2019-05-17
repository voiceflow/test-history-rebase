'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');
// const VError = require('@voiceflow/verror');
// const { utils } = require('@voiceflow/common');

// const { ProjectManager } = require('../../../lib/services');
const ProductUpdates = require('../../../lib/controllers/product_updates');

describe('product update controller unit tests', () => {
  beforeEach(() => sinon.restore());

  it('get updates', async () => {
    const services = {
      productManager: {
        getUpdates: sinon.stub().resolves([]),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const productUpdates = new ProductUpdates(services);

    const req = {};
    const res = {};
    const next = sinon.stub().returns();

    await productUpdates.getUpdates(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql([]);

    expect(services.productManager.getUpdates.callCount).to.eql(1);
  });

  it('create updates', async () => {
    const services = {
      productManager: {
        createUpdate: sinon.stub().resolves(),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const productUpdates = new ProductUpdates(services);

    const req = {
      body: {
        type: "a",
        details: "b",
      },
    };
    const res = {};
    const next = sinon.stub().returns();

    await productUpdates.createUpdate(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql();

    expect(services.productManager.createUpdate.args[0][0]).to.eql("a");
    expect(services.productManager.createUpdate.args[0][1]).to.eql("b");

  });
});
