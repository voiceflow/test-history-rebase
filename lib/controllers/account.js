'use strict';

const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.accountManager
 * @returns {object}
 */
const AccountController = (services) => {
  check(services, '', 'object');
  check(services, 'responseBuilder', 'object');
  check(services, 'accountManager', 'object');
  check(services, 'accountManager.AmazonAccessToken', 'object');

  const { accountManager, responseBuilder } = services

  const getAmazonToken = async (req, res) => {
    const action = async () => accountManager.getAmazonToken();
      return accountManager.getAmazonToken();
    }

    return responseBuilder.respond(res, action);
  };

  return {
    getAmazonToken,
  };
}

module.exports = AccountController;
