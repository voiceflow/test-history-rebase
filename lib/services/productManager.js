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
};

/**
 * @class
 */
class ProductManager {
  /**
   * @param {object} services
   * @param {object} services.pool
   */
  constructor(services) {
    validateServices(services);

    this.services = services;
  }

  async getUpdates() {
    const { rows } = (await this.services.pool.query('SELECT * FROM product_updates ORDER BY created DESC LIMIT 10'));
    return rows;
  }

  async createUpdate(type, details) {
    await this.services.pool.query('INSERT INTO product_updates (type, details) VALUES ($1, $2)', [type, details]);
  }
}

module.exports = ProductManager;
