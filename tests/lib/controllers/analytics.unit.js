'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');
// const VError = require('@voiceflow/verror');
// const { utils } = require('@voiceflow/common');

const DEFAULT_SERVICES = {
  projectManager: {},
  analyticsManager: {},
  segement: {},
};

// const { ProjectManager } = require('../../../lib/services');
const Analytics = require('../../../lib/controllers/analytics');

describe('analytics controller unit tests', () => {
  beforeEach(() => sinon.restore());

  it('get user data for skill use', async () => {
    const services = {
      ...DEFAULT_SERVICES,
      projectManager: {
        getProjectIdFromReq: sinon.stub().returns(123),
      },
      analyticsManager: {
        getUsersData: sinon.stub().resolves(['stuff']),
      },
    };

    const analytics = new Analytics(services);

    const req = {
      user: {
        admin: 1,
        id: 2,
      },
    };
    const res = null;
    const next = sinon.stub().returns();

    expect(await analytics.getUsersData(req, res, next)).to.eql(['stuff']);
    expect(next.callCount).to.eql(0);

    expect(services.analyticsManager.getUsersData.args[0][0]).to.eql(123);
    expect(services.projectManager.getProjectIdFromReq.args[0][0]).to.eql(req);
  });

  it('get skill use over time', async () => {
    const services = {
      ...DEFAULT_SERVICES,
      projectManager: {
        getProjectIdFromReq: sinon.stub().returns(123),
      },
      analyticsManager: {
        getDAU: sinon.stub().resolves(['stuff']),
      },
    };

    const analytics = new Analytics(services);

    const req = {
      user: {
        admin: 1,
        id: 2,
      },
      params: {
        from: '10',
        to: '20',
        user_tz: '5',
      },
    };
    const res = null;
    const next = sinon.stub().returns();

    expect(await analytics.getDAU(req, res, next)).to.eql(['stuff']);
    expect(next.callCount).to.eql(0);

    expect(services.analyticsManager.getDAU.args[0][0]).to.eql(123);
    expect(services.analyticsManager.getDAU.args[0][1]).to.eql(10);
    expect(services.analyticsManager.getDAU.args[0][2]).to.eql(20);
    expect(services.analyticsManager.getDAU.args[0][3]).to.eql(5);
    expect(services.projectManager.getProjectIdFromReq.args[0][0]).to.eql(req);
  });

  it('get stats skill use', async () => {
    const services = {
      projectManager: {
        getProjectIdFromReq: sinon.stub().returns(123),
      },
      analyticsManager: {
        getStats: sinon.stub().resolves(['stuff']),
      },
    };

    const analytics = new Analytics(services);

    const req = {
      user: {
        admin: 1,
        id: 2,
      },
    };
    const res = null;
    const next = sinon.stub().returns();

    expect(await analytics.getStats(req, res, next)).to.eql(['stuff']);
    expect(next.callCount).to.eql(0);

    expect(services.analyticsManager.getStats.args[0][0]).to.eql(123);
    expect(services.projectManager.getProjectIdFromReq.args[0][0]).to.eql(req);
  });
});
