'use strict';

const _ = require('lodash');
const VError = require('@voiceflow/verror');
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
};

/**
 * @class
 */
class Project {
  /**
   * @param {object} services
   * @param {ProjectManager} services.projectManager
   * @param {ResponseBuilder} services.responseBuilder
   */
  constructor(services) {
    validateServices(services);
    autoBind(this);

    this.services = services;
  }

  /**
   * Continue if request made by owner
   * @param {Request} req express request
   * @param {Response} res express response
   * @param {Function} next
   * @returns {Promise<Promise<void>|void|*>}
   */
  async isOwner(req, res, next) {
    try {
      if (!req.user) {
        throw new VError('req.user not defined');
      }

      // todo: figure out why this exists
      if (req.user.admin >= 100) {
        return next();
      }

      const projectId = this.services.projectManager.getProjectIdFromReq(req);

      if (await this.services.projectManager.isOwner(projectId, req.user.id)) {
        return next();
      }

      return this.services.responseBuilder.respond(res, new VError('not owner of project', VError.HTTP_STATUS.FORBIDDEN));
    } catch (err) {
      return this.services.responseBuilder.respond(res, err);
    }
  }
}

module.exports = Project;
