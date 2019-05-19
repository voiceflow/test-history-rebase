'use strict';

const _ = require('lodash');

const VError = require('@voiceflow/verror');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.pool)) {
    throw new Error('services.pool must be an object');
  }

  if (!_.isObject(services.hashids)) {
    throw new Error('services.hashids must be an object');
  }
};

/**
 * @class
 */
class ProjectManager {
  /**
   * @param {object} services
   * @param {object} services.pool
   * @param {object} services.hashids
   */
  constructor(services) {
    validateServices(services);

    this.services = services;
  }

  /**
   * Get project ID from request
   * @param {Request} req
   * @returns {*}
   */
  getProjectIdFromReq(req) {
    if (!_.isObject(req) || !_.isObject(req.params)) {
      throw new Error('req.params must be an object');
    }

    if (!req.params.project_id) {
      throw new VError('project_id not found on request', VError.HTTP_STATUS.BAD_REQUEST);
    }

    return this.services.hashids.decode(req.params.project_id)[0];
  }

  /**
   * Check if creatorId is owner of project
   * @param {number} projectId
   * @param {number} creatorId
   * @returns {Promise<boolean>}
   */
  async isOwner(projectId, creatorId) {
    if (!_.isInteger(projectId)) {
      throw new Error('projectId must be an integer');
    }

    if (!_.isInteger(creatorId)) {
      throw new Error('creatorId must be an integer');
    }

    const data = await this.services.pool.query('SELECT * FROM projects WHERE project_id = $1 AND creator_id = $2', [projectId, creatorId]);

    return data.rows.length > 0;
  }
}

module.exports = ProjectManager;
