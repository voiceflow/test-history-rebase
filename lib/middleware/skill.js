'use strict';

const _ = require('lodash');
const VError = require('@voiceflow/verror');
const autoBind = require('auto-bind');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.skillsManager)) {
    throw new Error('services.skillsManager must be an object');
  }

  if (!_.isObject(services.responseBuilder)) {
    throw new Error('services.responseBuilder must be an object');
  }

  if (!_.isObject(services.hashids)) {
    throw new Error('services.hashids must be an object');
  }
};

class Skill {
  /**
   * @param {object} services
   * @param {object} services.skillsManager
   * @param {object} services.responseBuilder
   * @param {object} services.hashids
   */
  constructor(services) {
    validateServices(services);
    autoBind(this);

    this.services = services;
  }

  /**
   * Continue if user has acess
   * @param {Request} req express request
   * @param {Response} res express response
   * @param {Function} next
   * @returns {Promise<Promise<void>|void|*>}
   */
  async hasSkillAccess(req, res, next) {
    try {
      if (!req.user) {
        throw new VError('req.user not defined');
      }

      const [skillId] = this.services.hashids.decode(req.params.skill_id);

      if (await this.services.skillsManager.checkSkillAccess(skillId, req.user.id)) {
        return next();
      }

      return this.services.responseBuilder.respond(res, new VError('No Access to Skill', VError.HTTP_STATUS.FORBIDDEN));
    } catch (err) {
      return this.services.responseBuilder.respond(res, err);
    }
  }
}

module.exports = Skill;
