'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');
// const VError = require('@voiceflow/verror');
// const { utils } = require('@voiceflow/common');

// const { ProjectManager } = require('../../../lib/services');
const Email = require('../../../lib/controllers/email');

describe('email controller unit tests', () => {
  beforeEach(() => sinon.restore());

  it('get template', async () => {
    const services = {
      emailManager: {
        getTemplate: sinon.stub().resolves("thing"),
      },
      hashids: {
        decode: sinon.stub().returns([0]),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const email = new Email(services);

    const req = {
      user: {
        id: 1,
      },
      params: {
        id: "a",
      },
    };
    const res = {};
    const next = sinon.stub().returns();

    await email.getTemplate(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql("thing");

    expect(services.hashids.decode.args[0][0]).to.eql("a");
    expect(services.emailManager.getTemplate.args[0][0]).to.eql(1);
    expect(services.emailManager.getTemplate.args[0][1]).to.eql(0);
  });

  it('get templates', async () => {
    const services = {
      emailManager: {
        getTemplates: sinon.stub().resolves([]),
      },
      hashids: {
        decode: sinon.stub().returns([0]),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const email = new Email(services);

    const req = {
      user: {
        id: 1,
      },
      params: {
        skill_id: "a",
      },
    };
    const res = {};
    const next = sinon.stub().returns();

    await email.getTemplates(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql([]);

    expect(services.hashids.decode.args[0][0]).to.eql("a");
    expect(services.emailManager.getTemplates.args[0][0]).to.eql(1);
    expect(services.emailManager.getTemplates.args[0][1]).to.eql(0);
  });

  it('set template', async () => {
    const services = {
      emailManager: {
        setTemplate: sinon.stub().resolves(),
      },
      hashids: {
        decode: sinon.stub().returns([0]),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const email = new Email(services);

    const req = {
      user: {
        id: 1,
      },
      params: {
        skill_id: "a",
        id: "b",
      },
      body: {},
    };
    const res = {};
    const next = sinon.stub().returns();

    await email.setTemplate(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql();

    expect(services.hashids.decode.args[0][0]).to.eql("b");
    expect(services.hashids.decode.args[1][0]).to.eql("a");

    expect(services.emailManager.setTemplate.args[0][0]).to.eql(1);
    expect(services.emailManager.setTemplate.args[0][1]).to.eql(0);
    expect(services.emailManager.setTemplate.args[0][2]).to.eql(0);
    expect(services.emailManager.setTemplate.args[0][3]).to.eql({});

  });

  it('delete template', async () => {
    const services = {
      emailManager: {
        deleteTemplate: sinon.stub().resolves(),
      },
      hashids: {
        decode: sinon.stub().returns([0]),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const email = new Email(services);

    const req = {
      user: {
        id: 1,
      },
      params: {
        id: "a",
      },
    };
    const res = {};
    const next = sinon.stub().returns();

    await email.deleteTemplate(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql();

    expect(services.hashids.decode.args[0][0]).to.eql("a");
    expect(services.emailManager.deleteTemplate.args[0][0]).to.eql(1);
    expect(services.emailManager.deleteTemplate.args[0][1]).to.eql(0);
  });
});
