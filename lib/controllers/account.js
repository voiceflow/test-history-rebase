'use strict';

const VError = require('@voiceflow/verror');
const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.accountManager
 * @param {object} services.responseBuilder
 * @returns {object}
 */
module.exports = function AccountController(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'responseBuilder', 'object');
  check(services, 'accountManager', 'object');
  check(services, 'accountManager.AmazonAccessToken', 'object');

  const { accountManager, responseBuilder } = services;
  const { route } = responseBuilder;

  /**
   * gets the user's access token and their associated amazon profile
   * @returns {{token, profile}}
   */
  self.getAccessToken = route(async (req) => {
    const token = await accountManager.AmazonAccessToken(req.user.id);
    if (!token) {
      throw new VError('no token associated with account', VError.HTTP_STATUS.NOT_FOUND);
    }

    const profile = await accountManager.fetchAmazonInfo(token);

    return {
      token,
      profile,
    };
  });

  /**
   * creates a new amazon session and responds with the code
   * @returns {string}
   */
  self.getAmazonCode = route((req) => accountManager.createAmazonSession(req.user.id, req.body.code));

  self.deleteAmazon = route((req) => accountManager.deleteAmazonAccessToken(req.user.id));

  self.hasGoogleAccessToken = route(async (req) => ({
    token: await accountManager.hasGoogleAccessToken(req.user.id),
  }));

  self.deleteGoogleAccessToken = route((req) => accountManager.deleteGoogleAccessToken(req.user.id));

  self.hasDialogflowToken = route(async (req) => ({
    token: await accountManager.hasDialogflowToken(req.user.id, req.params.project_id),
  }));

  self.verifyGoogleAccessToken = route((req) => accountManager.verifyGoogleAccessToken(req.user.id, req.body.token));

  self.verifyDialogflowToken = route((req) => accountManager.verifyDialogflowToken(req.user.id, req.body.project_id, req.body.token));

  self.deleteDialogflowToken = route((req) => accountManager.deleteDialogflowToken(req.body.project_id));

  self.getSession = route((req) => {
    if (req.user) return req.user;
    throw new VError('session not found', VError.HTTP_STATUS.NOT_FOUND);
  });

  self.getVendor = route(async (req) => {
    const vendor = await accountManager.AmazonAccessToken(req.user.id);
    if (!vendor) {
      throw new VError('no token associated with account', VError.HTTP_STATUS.NOT_FOUND);
    }
    return vendor;
  });

  self.deleteSession = route((req) => accountManager.deleteSession(req.user.id, req.cookies));

  self.putSession = route(async (req) => {
    const account = await accountManager.checkLogin(req.body);
    const { userHash, token, user } = await accountManager.createSession(account);
    return {
      token: userHash + token,
      user,
    };
  });

  self.googleLogin = route(async (req) => {
    const account = await accountManager.googleLogin(req.body);
    const { userHash, token, user } = await accountManager.createSession(account);
    return {
      token: userHash + token,
      user,
    };
  });

  self.facebookLogin = route(async (req) => {
    const account = await accountManager.facebookLogin(req.body);
    const { userHash, token, user } = await accountManager.createSession(account);
    return {
      token: userHash + token,
      user,
    };
  });

  self.putUser = route(async (req) => {
    const account = await accountManager.createUser(req.body);
    const { userHash, token, user } = await accountManager.createSession(account);
    return {
      token: userHash + token,
      user,
    };
  });

  self.getUser = route(async (req) => accountManager.getUser(req.user.id));

  self.resetPasswordEmail = route((req) => accountManager.resetPasswordEmail(req.body.email));

  self.checkReset = route((req) => accountManager.resetPassword(req.params.token));

  self.resetPassword = route((req) => accountManager.resetPassword(req.params.token, req.body.password));

  self.updateProfilePicture = route((req) => accountManager.updateProfilePicture(req.user.id, req.file.transforms[0].key));

  return self;
};
