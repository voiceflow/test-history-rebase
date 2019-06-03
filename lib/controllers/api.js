'use strict';

const { check } = require('@voiceflow/common').utils;
const VError = require('@voiceflow/verror');

const _ = require('lodash');

module.exports = function(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'apiManager', 'object');

  const { apiManager } = services;

  self.getToken = async (req) => {
    const key = await apiManager.getToken(req.user.id);
    return { key };
  };

  self.getUser = async (req) => {
    const user = await apiManager.getUser(req.headers.authorization);
    if (_.isEmpty(user)) {
      throw new VError('Invalid Token', 401);
    } else {
      return user;
    }
  };

  return self;
};
