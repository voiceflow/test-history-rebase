'use strict';

const VError = require('@voiceflow/verror');
const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.skillsManager
 * @param {object} services.hashids
 */
function Skill(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'skillsManager', 'object');
  check(services, 'hashids', 'object');

  const { skillsManager, hashids } = services;

  /**
   * Continue if user has acess
   * @param {Request} req express request
   * @param {Response} res express response
   * @param {Function} next
   * @returns {Promise<Promise<void>|void|*>}
   */
  self.hasSkillAccess = async (req, res, next) => {
    if (!req.user) {
      throw new VError('req.user not defined');
    }

    const [skillId] = hashids.decode(req.params.skill_id);

    if (await skillsManager.checkSkillAccess(skillId, req.user.id)) {
      return next();
    }

    throw new VError('No Access to Skill', VError.HTTP_STATUS.FORBIDDEN);
  };

  return self;
}

module.exports = Skill;
