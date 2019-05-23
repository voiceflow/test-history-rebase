'use strict';

const VError = require('@voiceflow/verror');
const { check } = require('@voiceflow/common').utils;

/**
 * @param {object} services
 * @param {object} services.accountManager
 * @returns {object}
 */
module.exports = function AccountController(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'accountManager', 'object');

  const { accountManager } = services;

  /**
   * gets the user's access token and their associated amazon profile
   * @returns {{token, profile}}
   */
  self.getAccessToken = async (req) => {
    const token = await accountManager.AmazonAccessToken(req.user.id);
    if (!token) {
      throw new VError('no token associated with account', VError.HTTP_STATUS.NOT_FOUND);
    }

    const profile = await accountManager.fetchAmazonInfo(token);

    return {
      token,
      profile,
    };
  };

  /**
   * creates a new amazon session and responds with the code
   * @returns {string}
   */
  self.getAmazonCode = (req) => accountManager.createAmazonSession(req.user.id, req.body.code);

  self.deleteAmazon = (req) => accountManager.deleteAmazonAccessToken(req.user.id);

  self.hasGoogleAccessToken = async (req) => ({
    token: await accountManager.hasGoogleAccessToken(req.user.id),
  });

  self.deleteGoogleAccessToken = (req) => accountManager.deleteGoogleAccessToken(req.user.id);

  self.hasDialogflowToken = async (req) => ({
    token: await accountManager.hasDialogflowToken(req.user.id, req.params.project_id),
  });

  self.verifyGoogleAccessToken = (req) => accountManager.verifyGoogleAccessToken(req.user.id, req.body.token);

  self.verifyDialogflowToken = (req) => accountManager.verifyDialogflowToken(req.user.id, req.body.project_id, req.body.token);

  self.deleteDialogflowToken = (req) => accountManager.deleteDialogflowToken(req.body.project_id);

  self.getSession = (req) => {
    if (req.user) return req.user;
    throw new VError('session not found', VError.HTTP_STATUS.NOT_FOUND);
  };

  self.getVendor = async (req) => {
    const vendor = await accountManager.AmazonAccessToken(req.user.id);
    if (!vendor) {
      throw new VError('no token associated with account', VError.HTTP_STATUS.NOT_FOUND);
    }
    return vendor;
  };

  self.deleteSession = (req) => accountManager.deleteSession(req.user.id, req.cookies);

  self.putSession = async (req) => {
    const account = await accountManager.checkLogin(req.body);
    const { userHash, token, user } = await accountManager.createSession(account);
    return {
      token: userHash + token,
      user,
    };
  };

  self.googleLogin = async (req) => {
    const account = await accountManager.googleLogin(req.body);
    const { userHash, token, user } = await accountManager.createSession(account);
    return {
      token: userHash + token,
      user,
    };
  };

  self.facebookLogin = async (req) => {
    const account = await accountManager.facebookLogin(req.body);
    const { userHash, token, user } = await accountManager.createSession(account);
    return {
      token: userHash + token,
      user,
    };
  };

  self.putUser = async (req) => {
    const account = await accountManager.createUser(req.body);
    const { userHash, token, user } = await accountManager.createSession(account);
    return {
      token: userHash + token,
      user,
    };
  };

  self.getUser = async (req) => accountManager.getUser(req.user.id);

  self.resetPasswordEmail = (req) => accountManager.resetPasswordEmail(req.body.email);

  self.checkReset = (req) => accountManager.resetPassword(req.params.token);

  self.resetPassword = (req) => accountManager.resetPassword(req.params.token, req.body.password);

  self.updateProfilePicture = (req) => accountManager.updateProfilePicture(req.user.id, req.file.transforms[0].key);

  return self;
};
