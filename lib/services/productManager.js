'use strict';

const _ = require('lodash');

const VError = require('@voiceflow/verror');

const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.pool
 * @returns {object}
 */
module.exports = function ProductManager(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'pool', 'object');

  const { pool } = services;

  /**
   * Get product updates
   * @returns {Promise<*>}
   */
  self.getUpdates = async () => {
    const { rows } = await pool.query('SELECT * FROM product_updates ORDER BY created DESC LIMIT 10');
    return rows;
  };

  /**
   * Create update
   * @param {string} type
   * @param {string} details
   * @returns {Promise<void>}
   */
  self.createUpdate = async (type, details) => {
    if (!_.isString(type)) {
      throw new VError('type is not string', VError.HTTP_STATUS.BAD_REQUEST);
    }

    if (!_.isString(details)) {
      throw new VError('details is not string', VError.HTTP_STATUS.BAD_REQUEST);
    }

    await pool.query('INSERT INTO product_updates (type, details) VALUES ($1, $2)', [type, details]);
  };

  return self;
};
