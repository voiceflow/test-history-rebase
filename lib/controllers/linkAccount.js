'use strict';

const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.linkManager
 * @param {object} services.responseBuilder
 * @param {object} services.hashids
 */
module.exports = function Decode(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'linkManager', 'object');
  check(services, 'hashids', 'object');

  const { hashids, linkManager } = services;

  /**
   * Get template
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.getTemplate = (req) => {
    const [skillId] = hashids.decode(req.params.skill_id);
    return linkManager.getTemplate(skillId);
  };

  /**
   * Set template
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.setTemplate = (req) => {
    const [skillId] = hashids.decode(req.params.skill_id);
    const payload = req.body;

    return linkManager.setTemplate(skillId, payload);
  };

  return self;
};
