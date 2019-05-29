'use strict';

const _ = require('lodash');
const autoBind = require('auto-bind');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.adminManager)) {
    throw new Error('services.adminManager must be an object');
  }

  if (!_.isObject(services.responseBuilder)) {
    throw new Error('services.responseBuilder must be an object');
  }
};

/**
 * @class
 */
class Admin {
  /**
   * @param {object} services
   * @param {object} services.adminManager
   */
  constructor(services) {
    validateServices(services);
    autoBind(this);

    this.services = services;
  }

  /**
   * Get all attributes of user from user id
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async getUsersData(req, res) {
    const action = async () => {
      return this.services.adminManager.getCreatorData(req.params.user_id, false);
    };

    return this.services.responseBuilder.respond(res, action);
  }

  /**
   * Get all attributes of user from user id
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async getUsersDataEmail(req, res) {
    const action = async () => {
      return this.services.adminManager.getCreatorData(req.params.user_email, true);
    };

    return this.services.responseBuilder.respond(res, action);
  }
}

module.exports = Admin;
