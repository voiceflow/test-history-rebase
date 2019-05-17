'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');
// const VError = require('@voiceflow/verror');
// const { utils } = require('@voiceflow/common');

// const { ProjectManager } = require('../../../lib/services');
const Decode = require('../../../lib/controllers/decode');

describe('decode controller unit tests', () => {
  beforeEach(() => sinon.restore());

  it('decode id', async () => {
    const services = {
      hashids: {
        encode: sinon.stub().returns("a"),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const decode = new Decode(services);

    const req = {
      params: {
        id: 1,
      }
    };
    const res = {};
    const next = sinon.stub().returns();

    await decode.decodeId(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql("a");

    expect(services.hashids.encode.args[0][0]).to.eql(1);
  });

  it('encode id', async () => {
    const services = {
      hashids: {
        decode: sinon.stub().returns([1]),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
    };

    const decode = new Decode(services);

    const req = {
      params: {
        id: "a",
      }
    };
    const res = {};
    const next = sinon.stub().returns();

    await decode.encodeId(req, res, next);

    expect(next.callCount).to.eql(0);
    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);

    const action = services.responseBuilder.respond.args[0][1];
    expect(await action()).to.eql('1');

    expect(services.hashids.decode.args[0][0]).to.eql("a");
  });
});
