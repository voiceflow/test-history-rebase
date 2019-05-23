'use strict';

const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.projectManager
 * @param {object} services.analyticsManager
 * @param {object} services.responseBuilder
 */
module.exports = function Analytics(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'projectManager', 'object');
  check(services, 'analyticsManager', 'object');
  check(services, 'responseBuilder', 'object');

  const { analyticsManager, projectManager, responseBuilder } = services;
  const { route } = responseBuilder;

  /**
   * Get stats around skill use
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.getUsersData = route((req) => {
    const projectId = projectManager.getProjectIdFromReq(req);
    return analyticsManager.getUsersData(projectId);
  });

  /**
   * Get stats over data range
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.getDAU = route((req) => {
    const projectId = projectManager.getProjectIdFromReq(req);

    return analyticsManager.getDAU(projectId, parseInt(req.params.from, 10), parseInt(req.params.to, 10), parseInt(req.params.user_tz, 10));
  });

  /**
   * Get overall stats for skill
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.getStats = route((req) => {
    const projectId = projectManager.getProjectIdFromReq(req);

    return analyticsManager.getStats(projectId);
  });

  return self;
};
