'use strict';

const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.adminManager
 */
function Admin(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'adminManager', 'object');

  const { adminManager } = services;

  self.getUsersData = async (req) => adminManager.getCreatorData(req.params.user_id, false);
  self.getUsersDataEmail = async (req) => adminManager.getCreatorData(req.params.user_email, true);

  return self;
}

module.exports = Admin;
