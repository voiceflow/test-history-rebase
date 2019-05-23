'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');

const Admin = require('../../../lib/controllers/admin');

describe('admin controller unit tests', () => {
  beforeEach(() => sinon.restore());

  it('gets creator data', async () => {
    const services = {
      adminManager: {
        getCreatorData: sinon.stub().resolves(['stuff']),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const admin = new Admin(services);

    const req = {
      params: {
        user_id: 2,
      },
    };
    const res = {};
    const next = sinon.stub().returns();

    await admin.getUsersData(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql(['stuff']);
  });
});
