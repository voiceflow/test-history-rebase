'use strict';

const _ = require('lodash');
const autoBind = require('auto-bind');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.linkManager)) {
    throw new Error('services.linkManager must be an object');
  }

  if (!_.isObject(services.responseBuilder)) {
    throw new Error('services.responseBuilder must be an object');
  }

  if (!_.isObject(services.hashids)) {
    throw new Error('services.hashids must be an object');
  }
};

/**
 * @class
 */
class Linking {
  /**
   * @param {object} services
   * @param {object} services.linkManager
   * @param {object} services.responseBuilder
   * @param {object} services.hashids

   */
  constructor(services) {
    validateServices(services);
    autoBind(this);

    this.services = services;
  }

  /**
   * Get template
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async getTemplate(req, res) {
    const action = async () => {
      const [skillId] = this.services.hashids.decode(req.params.skill_id);

      return this.services.linkManager.getTemplate(skillId);
    };

    return this.services.responseBuilder.respond(res, action);
  }

  /**
   * Set template
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async setTemplate(req, res) {
    const action = async () => {
      const [skillId] = this.services.hashids.decode(req.params.skill_id);
      const payload = req.body;

      return this.services.linkManager.setTemplate(skillId, payload);
    };

    return this.services.responseBuilder.respond(res, action);
  }
}

module.exports = Linking;
