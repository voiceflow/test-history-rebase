'use strict';

const VError = require('@voiceflow/verror');
const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {ProjectManager} services.projectManager
 */
function Project(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'projectManager', 'object');

  const { projectManager } = services;

  /**
   * Continue if request made by owner
   * @param {Request} req express request
   * @param {Response} res express response
   * @param {Function} next
   * @returns {Promise<Promise<void>|void|*>}
   */
  self.isOwner = async (req, res, next) => {
    if (!req.user) {
      throw new VError('req.user not defined');
    }

    // todo: figure out why this exists
    if (req.user.admin >= 100) {
      return next();
    }

    const projectId = projectManager.getProjectIdFromReq(req);

    if (await projectManager.isOwner(projectId, req.user.id)) {
      return next();
    }

    throw new VError('not owner of project', VError.HTTP_STATUS.FORBIDDEN);
  };

  return self;
}

module.exports = Project;
