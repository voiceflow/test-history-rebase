'use strict';

const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.hashids
 */
module.exports = function Decode(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'hashids', 'object');

  const { hashids } = services;

  /**
   * Decode ID
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.decodeId = (req) => hashids.encode(req.params.id);

  /**
   * Decode ID
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  self.encodeId = (req) => {
    const [id] = this.services.hashids.decode(req.params.id);
    return id.toString();
  };

  return self;
};
