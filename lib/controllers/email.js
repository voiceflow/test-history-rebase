'use strict';

const _ = require('lodash');
const autoBind = require('auto-bind');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.emailManager)) {
    throw new Error('services.emailManager must be an object');
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
class Email {
  /**
   * @param {object} services
   * @param {object} services.emailManager
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
      const [id] = this.services.hashids.decode(req.params.id);

      return this.services.emailManager.getTemplate(req.user.id, id);
    };

    return this.services.responseBuilder.respond(res, action);
  }

  /**
   * Get templates
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async getTemplates(req, res) {
    const action = async () => {
      const [skill_id] = this.services.hashids.decode(req.params.skill_id);

      return this.services.emailManager.getTemplates(req.user.id, skill_id);
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
      const [id] = this.services.hashids.decode(req.params.id);
      const [skill_id] = this.services.hashids.decode(req.params.skill_id);
      const payload = req.body;

      return this.services.emailManager.setTemplate(req.user.id, skill_id, id, payload);
    };

    return this.services.responseBuilder.respond(res, action);
  }

  /**
   * Delete template
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async deleteTemplate(req, res) {
    const action = async () => {
      const [id] = this.services.hashids.decode(req.params.id);

      return this.services.emailManager.deleteTemplate(req.user.id, id);
    };

    return this.services.responseBuilder.respond(res, action);
  }
}

module.exports = Email;
