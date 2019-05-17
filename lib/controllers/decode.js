'use strict';

const _ = require('lodash');
const autoBind = require('auto-bind');

const validateServices = (services) => {
  if (!_.isObject(services)) {
    throw new Error('services must be an object');
  }

  if (!_.isObject(services.responseBuilder)) {
    throw new Error('services.responseBuilder must be an object');
  }

  if (!_.isObject(services.hashids)) {
    throw new Error('services.hashids must be an object');
  }
};

/**
 * @class
 */
class Decode {
  /**
   * @param {object} services
   * @param {object} services.hashids

   */
  constructor(services) {
    validateServices(services);
    autoBind(this);

    this.services = services;
  }

  /**
   * Decode ID
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async decodeId(req, res) {
    const action = async () => {
      return this.services.hashids.encode(req.params.id);
    };

    return this.services.responseBuilder.respond(res, action);
  }

  /**
   * Decode ID
   * @param {Request} req express request
   * @param {Response} res express response
   * @returns {Promise<void>}
   */
  async encodeId(req, res) {
    const action = async () => {
      const [id] = this.services.hashids.decode(req.params.id);
      return id.toString();
    };

    return this.services.responseBuilder.respond(res, action);
  }



}

module.exports = Decode;
