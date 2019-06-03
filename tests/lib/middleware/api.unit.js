'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');
// const { utils } = require('@voiceflow/common');

// const { ProjectManager } = require('../../../lib/services');
const Api = require('../../../lib/middleware/api');

describe('api middleware unit tests', () => {
  beforeEach(() => sinon.restore());

  it('next with user if key is good', async () => {
    const services = {
      apiManager: {
        getUser: sinon.stub().resolves({ id: 101 }),
      },
    };

    const api = new Api(services);

    const req = {
      body: {
        key: '123',
      },
    };
    const res = null;
    const next = sinon.stub().returns();

    await api.getUser(req, res, next);

    expect(services.apiManager.getUser.args[0][0]).to.eql('123');
    expect(req.user).to.eql({ id: 101 });
    expect(req.body.key).to.eql(undefined);
    expect(next.callCount).to.eql(1);
  });

  it('next if no key', async () => {
    const services = {
      apiManager: {
        getUser: sinon.stub().resolves({ id: 101 }),
      },
    };

    const api = new Api(services);

    const req = {
      user: {
        id: 1,
      },
      body: {
        test: '123',
      },
    };
    const res = null;
    const next = sinon.stub().returns();

    await api.getUser(req, res, next);

    expect(services.apiManager.getUser.callCount).to.eql(0);
    expect(req.user).to.eql({ id: 1 });
    expect(req.body.test).to.eql('123');
    expect(next.callCount).to.eql(1);
  });

  it('not next if key is bad', async () => {
    const services = {
      apiManager: {
        getUser: sinon.stub().resolves(undefined),
      },
    };

    const api = new Api(services);

    const req = {
      body: {
        key: '123',
      },
    };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);
    const next = sinon.stub().returns();

    await api.getUser(req, res, next);

    expect(services.apiManager.getUser.args[0][0]).to.eql('123');
    expect(next.callCount).to.eql(0);
    expect(res.status.args[0][0]).to.eql(401);
    expect(res.send.args[0][0]).to.eql('Bad token');
  });
});
