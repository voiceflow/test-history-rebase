'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');
// const VError = require('@voiceflow/verror');
// const { utils } = require('@voiceflow/common');

// const { ProjectManager } = require('../../../lib/services');
const Linking = require('../../../lib/controllers/linkAccount');

describe('linking controller unit tests', () => {
  beforeEach(() => sinon.restore());

  it('get link', async () => {
    const services = {
      linkManager: {
        getTemplate: sinon.stub().resolves('thing'),
      },
      hashids: {
        decode: sinon.stub().returns([0]),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const linking = new Linking(services);

    const req = {
      params: {
        skill_id: 'a',
      },
    };
    const res = {};
    const next = sinon.stub().returns();

    await linking.getTemplate(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql('thing');

    expect(services.hashids.decode.args[0][0]).to.eql('a');
    expect(services.linkManager.getTemplate.args[0][0]).to.eql(0);
  });

  it('set template', async () => {
    const services = {
      linkManager: {
        setTemplate: sinon.stub().resolves(),
      },
      hashids: {
        decode: sinon.stub().returns([0]),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const linking = new Linking(services);

    const req = {
      params: {
        skill_id: 'a',
      },
      body: {},
    };
    const res = {};
    const next = sinon.stub().returns();

    await linking.setTemplate(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql();

    expect(services.hashids.decode.args[0][0]).to.eql('a');

    expect(services.linkManager.setTemplate.args[0][0]).to.eql(0);
    expect(services.linkManager.setTemplate.args[0][1]).to.eql({});
  });
});
