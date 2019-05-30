'use strict';

require('dotenv').config({ path: './.env.test' });
const { expect } = require('chai');
const sinon = require('sinon');
const VError = require('@voiceflow/verror');
// const { utils } = require('@voiceflow/common');

// const { ProjectManager } = require('../../../lib/services');
const Skill = require('../../../lib/middleware/skill');

describe('skill middleware unit tests', () => {
  beforeEach(() => sinon.restore());

  it('next if user has skill access', async () => {
    const services = {
      skillsManager: {
        checkSkillAccess: sinon.stub().resolves(true),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
      hashids: {
        decode: sinon.stub().returns([0]),
      },
    };

    const skill = new Skill(services);

    const req = {
      user: {
        id: 1,
      },
      params: {
        skill_id: 'a',
      },
    };
    const res = {};
    const next = sinon.stub().returns();

    await skill.hasSkillAccess(req, res, next);

    expect(services.hashids.decode.args[0][0]).to.eql('a');

    expect(services.skillsManager.checkSkillAccess.args[0][0]).to.eql(0);
    expect(services.skillsManager.checkSkillAccess.args[0][1]).to.eql(1);
    expect(next.callCount).to.eql(1);
    expect(services.responseBuilder.respond.callCount).to.eql(0);
  });

  it('not next if user does not have skill access', async () => {
    const services = {
      skillsManager: {
        checkSkillAccess: sinon.stub().resolves(false),
      },
      responseBuilder: {
        respond: sinon.stub().resolves(),
      },
      hashids: {
        decode: sinon.stub().returns([0]),
      },
    };

    const skill = new Skill(services);

    const req = {
      user: {
        id: 1,
      },
      params: {
        skill_id: 'a',
      },
    };
    const res = sinon.stub().returns();
    const next = sinon.stub().returns();
    let error;

    try {
      await skill.hasSkillAccess(req, res, next);
    } catch (err) {
      error = err;
    }

    expect(services.hashids.decode.args[0][0]).to.eql('a');

    expect(services.skillsManager.checkSkillAccess.args[0][0]).to.eql(0);
    expect(services.skillsManager.checkSkillAccess.args[0][1]).to.eql(1);

    expect(res.callCount).to.eql(0);
    expect(next.callCount).to.eql(0);

    expect(error instanceof Error).to.be.true;
    expect(error.message).to.eql('No Access to Skill');
    expect(error.code).to.eql(VError.HTTP_STATUS.FORBIDDEN);
  });
});
