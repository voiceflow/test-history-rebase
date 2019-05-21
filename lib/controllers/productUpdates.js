'use strict';

const _ = require('lodash');
const autoBind = require('auto-bind');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.productManager)) {
    throw new Error('services.linkManager must be an object');
  }

  if (!_.isObject(services.responseBuilder)) {
    throw new Error('services.responseBuilder must be an object');
  }
};

/**
 * @class
 */
class ProductUpdates {
  /**
   * @param {object} services
   * @param {object} services.productManager
   * @param {object} services.responseBuilder
   */
  constructor(services) {
    validateServices(services);
    autoBind(this);

    this.services = services;
  }

  /**
   * Get product updates
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async getUpdates(req, res) {
    const action = async () => this.services.productManager.getUpdates();

    return this.services.responseBuilder.respond(res, action);
  }

  /**
   * Create product update
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async createUpdate(req, res) {
    const action = async () => this.services.productManager.createUpdate(req.body.type, req.body.details);

    return this.services.responseBuilder.respond(res, action);
  }
}

module.exports = ProductUpdates;
