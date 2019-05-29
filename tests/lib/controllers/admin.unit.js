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
    };

    const admin = new Admin(services);

    const req = {
      params: {
        user_id: 2,
      },
    };
    const res = sinon.stub().returns();
    const next = sinon.stub().returns();

    expect(await admin.getUsersData(req, res, next)).to.eql(['stuff']);
    expect(next.callCount).to.eql(0);
    expect(res.callCount).to.eql(0);
  });
});
