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
    const res = {};
    const next = sinon.stub().returns();

    await skill.hasSkillAccess(req, res, next);

    expect(services.hashids.decode.args[0][0]).to.eql('a');

    expect(services.skillsManager.checkSkillAccess.args[0][0]).to.eql(0);
    expect(services.skillsManager.checkSkillAccess.args[0][1]).to.eql(1);

    expect(next.callCount).to.eql(0);

    expect(services.responseBuilder.respond.callCount).to.eql(1);
    expect(services.responseBuilder.respond.args[0][0]).to.eql(res);
    expect(services.responseBuilder.respond.args[0][1].message).to.eql('No Access to Skill');
    expect(services.responseBuilder.respond.args[0][1].code).to.eql(VError.HTTP_STATUS.FORBIDDEN);
  });
});
