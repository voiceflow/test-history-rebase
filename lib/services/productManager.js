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

  /**
   * Get product updates
   * @returns {Promise<*>}
   */
  async getUpdates() {
    const { rows } = await this.services.pool.query('SELECT * FROM product_updates ORDER BY created DESC LIMIT 10');
    return rows;
  }

  /**
   * Create update
   * @param {string} type
   * @param {string} details
   * @returns {Promise<void>}
   */
  async createUpdate(type, details) {
    if (!_.isString(type)) {
      throw new VError('type is not string', VError.HTTP_STATUS.BAD_REQUEST);
    }

    if (!_.isString(details)) {
      throw new VError('details is not string', VError.HTTP_STATUS.BAD_REQUEST);
    }

    await this.services.pool.query('INSERT INTO product_updates (type, details) VALUES ($1, $2)', [type, details]);
  }
}

module.exports = ProductManager;
