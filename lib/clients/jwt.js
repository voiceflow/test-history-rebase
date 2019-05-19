'use strict';

const { sign, verify, decode } = require('jsonwebtoken');

/**
 * @class
 */
class JWT {
  constructor(secret) {
    this.secret = secret;
  }

  sign(payload, options, callback) {
    return sign(payload, this.secret, options, callback);
  }

  verify(token, options, callback) {
    return verify(token, this.secret, options, callback);
  }

  decode(token, options) {
    return decode(token, options);
  }
}

module.exports = JWT;
