'use strict';

const _ = require('lodash');
const autoBind = require('auto-bind');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.projectManager)) {
    throw new Error('services.projectManager must be an object');
  }

  if (!_.isObject(services.responseBuilder)) {
    throw new Error('services.responseBuilder must be an object');
  }

  if (!_.isObject(services.analyticsManager)) {
    throw new Error('services.analyticsManager must be an object');
  }
};

/**
 * @class
 */
class Analytics {
  /**
   * @param {object} services
   * @param {object} services.projectManager
   * @param {object} services.analyticsManager
   */
  constructor(services) {
    validateServices(services);
    autoBind(this);

    this.services = services;
  }

  /**
   * Get stats around skill use
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async getUsersData(req, res) {
    const action = async () => {
      const projectId = this.services.projectManager.getProjectIdFromReq(req);

      return this.services.analyticsManager.getUsersData(projectId);
    };

    return this.services.responseBuilder.respond(res, action);
  }

  /**
   * Get stats over data range
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async getDAU(req, res) {
    const action = async () => {
      const projectId = this.services.projectManager.getProjectIdFromReq(req);

      return this.services.analyticsManager.getDAU(projectId, req.params.from, req.params.to, req.params.user_tz);
    };

    return this.services.responseBuilder.respond(res, action);
  }

  /**
   * Get overall stats for skill
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async getStats(req, res) {
    const action = async () => {
      const projectId = this.services.projectManager.getProjectIdFromReq(req);

      return this.services.analyticsManager.getStats(projectId);
    };

    return this.services.responseBuilder.respond(res, action);
  }
}

module.exports = Analytics;
