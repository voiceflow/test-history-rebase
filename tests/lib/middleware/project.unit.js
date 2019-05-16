'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');
const VError = require('@voiceflow/verror');
// const { utils } = require('@voiceflow/common');

// const { ProjectManager } = require('../../../lib/services');
const Project = require('../../../lib/middleware/project');

describe('project middleware unit tests', () => {
  beforeEach(() => sinon.restore());

  it('next if user is owner of project', async () => {
    const services = {
      projectManager: {
        isOwner: sinon.stub().resolves(true),
        getProjectIdFromReq: sinon.stub().returns(123),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const project = new Project(services);

    const req = {
      user: {
        admin: 1,
        id: 2,
      },
    };
    const res = {};
    const next = sinon.stub().returns();

    await project.isOwner(req, res, next);

    expect(services.projectManager.isOwner.args[0][0]).to.eql(123);
    expect(services.projectManager.isOwner.args[0][1]).to.eql(2);
    expect(next.callCount).to.eql(1);
    expect(services.responseBuilder.respond.callCount).to.eql(0);
  });

  it('not next if user is not owner of project', async () => {
    const services = {
      projectManager: {
        isOwner: sinon.stub().resolves(false),
        getProjectIdFromReq: sinon.stub().returns(123),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const project = new Project(services);

    const req = {
      user: {
        admin: 1,
        id: 2,
      },
    };
    const res = {};
    const next = sinon.stub().returns();

    await project.isOwner(req, res, next);

    expect(services.projectManager.isOwner.args[0][0]).to.eql(123);
    expect(services.projectManager.isOwner.args[0][1]).to.eql(2);
    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);
    expect(services.responseBuilder.respond.args[0][1].message).to.eql('not owner of project');
    expect(services.responseBuilder.respond.args[0][1].code).to.eql(VError.HTTP_STATUS.FORBIDDEN);
  });
});
