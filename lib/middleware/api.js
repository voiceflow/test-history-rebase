'use strict';

const { check } = require('@voiceflow/common').utils;

const _ = require('lodash');

module.exports = function(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'apiManager', 'object');

  const { apiManager } = services;

  self.getUser = async (req, res, next) => {
    if (req.body && req.body.key) {
      const user = await apiManager.getUser(req.body.key);
      delete req.body.key;
      if (_.isEmpty(user)) {
        res.status(401).send('Bad token');
        return;
      }
      req.user = user;
    }
    next();
  };

  return self;
};
