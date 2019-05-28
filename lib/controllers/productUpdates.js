'use strict';

const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.productManager
 */
module.exports = function ProductUpdates(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'productManager', 'object');

  const { productManager } = services;

  /**
   * Get product updates
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.getUpdates = () => productManager.getUpdates();

  /**
   * Create product update
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.createUpdate = (req) => productManager.createUpdate(req.body.type, req.body.details);

  return self;
};
