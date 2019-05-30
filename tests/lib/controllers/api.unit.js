'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');

const Api = require('../../../lib/controllers/api');

describe('api controller unit tests', () => {
  beforeEach(() => sinon.restore());

  it('gets token', async () => {
    const services = {
      apiManager: {
        getToken: sinon.stub().resolves('123'),
      },
    };

    const api = new Api(services);

    const req = {
      user: {
        id: 2,
      },
    };
    const res = null;
    const next = sinon.stub().returns();

    expect(await api.getToken(req, res, next)).to.eql({ key: '123' });
    expect(next.callCount).to.eql(0);

    expect(services.apiManager.getToken.args[0][0]).to.eq(2);
  });
  it('gets user', async () => {
    const services = {
      apiManager: {
        getUser: sinon.stub().resolves({ name: 'Bob' }),
      },
    };

    const api = new Api(services);

    const req = {
      headers: {
        authorization: '123',
      },
    };
    const res = null;
    const next = sinon.stub().returns();

    expect(await api.getUser(req, res, next)).to.eql({ name: 'Bob' });
    expect(next.callCount).to.eql(0);

    expect(services.apiManager.getUser.args[0][0]).to.eq('123');
  });

  it('deny user', async () => {
    const services = {
      apiManager: {
        getUser: sinon.stub().resolves(undefined),
      },
    };

    const api = new Api(services);

    const req = {
      headers: {
        authorization: '123',
      },
    };
    const res = null;
    const next = sinon.stub().returns();

    const result = await api
      .getUser(req, res, next)
      .then(() => new Error('should reject'))
      .catch((err) => err.message);
    expect(result).to.eql('Invalid Token');
    expect(next.callCount).to.eql(0);

    expect(services.apiManager.getUser.args[0][0]).to.eq('123');
  });
});
