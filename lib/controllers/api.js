'use strict';

const { check } = require('@voiceflow/common').utils;

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
    res.send(user);
  };

  return self;
};
