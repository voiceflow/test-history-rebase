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
        encode: sinon.stub().returns('a'),
      },
    };

    const decode = new Decode(services);

    const req = {
      params: {
        id: 1,
      },
    };

    const res = null;
    const next = sinon.stub().returns();

    expect(await decode.decodeId(req, res, next)).to.eql('a');
    expect(next.callCount).to.eql(0);

    expect(services.hashids.encode.args[0][0]).to.eql(1);
  });

  it('encode id', async () => {
    const services = {
      hashids: {
        decode: sinon.stub().returns([1]),
      },
    };

    const decode = new Decode(services);

    const req = {
      params: {
        id: 'a',
      },
    };

    const res = null;
    const next = sinon.stub().returns();

    expect(await decode.encodeId(req, res, next)).to.eql('1');
    expect(next.callCount).to.eql(0);

    expect(services.hashids.decode.args[0][0]).to.eql('a');
  });
});
