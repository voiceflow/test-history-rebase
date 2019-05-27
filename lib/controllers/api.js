'use strict';

const { check } = require('@voiceflow/common').utils;

const _ = require('lodash');

module.exports = function(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'apiManager', 'object');

  const { apiManager } = services;

  self.getToken = async (req, res) => {
    const key = await apiManager.getToken(req.user.id);
    res.send({ key });
  };

  self.getUser = async (req, res) => {
    const user = await apiManager.getUser(req.headers.authorization);
    if (_.isEmpty(user)) {
      res.status(401).send('Invalid Token');
    } else {
      res.send(user);
    }
  };

  return self;
};
