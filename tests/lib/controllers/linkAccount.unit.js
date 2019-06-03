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
    };

    const linking = new Linking(services);

    const req = {
      params: {
        skill_id: 'a',
      },
    };
    const res = null;
    const next = sinon.stub().returns();

    expect(await linking.getTemplate(req, res, next)).to.eql('thing');
    expect(next.callCount).to.eql(0);

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
    };

    const linking = new Linking(services);

    const req = {
      params: {
        skill_id: 'a',
      },
      body: {},
    };
    const res = null;
    const next = sinon.stub().returns();

    expect(await linking.setTemplate(req, res, next)).to.eql();
    expect(next.callCount).to.eql(0);

    expect(services.hashids.decode.args[0][0]).to.eql('a');

    expect(services.linkManager.setTemplate.args[0][0]).to.eql(0);
    expect(services.linkManager.setTemplate.args[0][1]).to.eql({});
  });
});
