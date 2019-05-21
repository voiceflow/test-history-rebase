'use strict';

const { sign, verify, decode } = require('jsonwebtoken');
const { check } = require('@voiceflow/common').utils;

const JWT = function(secret) {
  check(secret, '', 'string');

  return {
    sign: (payload, options, callback) => sign(payload, secret, options, callback),
    verify: (token, options, callback) => verify(token, secret, options, callback),
    decode: (token, options) => decode(token, options),
  };
};

module.exports = JWT;
