'use strict';

const axios = require('axios');
const VError = require('@voiceflow/verror');

module.exports = function() {
  const self = {};
  self.addUser = async (req) => {
    if (!req.body) throw new VError('Missing Body', 401);
    req.body.creator_id = req.user.id;
    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/add_user`, req.body);
    return resp.data;
  };

  self.deleteUser = async (req) => {
    if (!req.body) throw new VError('Missing Body', 401);
    req.body.creator_id = req.user.id;

    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/delete_user`, req.body);
    return resp.data;
  };

  self.getAllUsers = async (req) => {
    const creator_id = req.user && req.user.id;
    if (!creator_id) throw new VError('Missing Body', 401);

    const resp = await axios.post(`${process.env.INTEGRATIONS_LAMBDA_ENDPOINT}/get_users`, { creator_id });
    return resp.data;
  };
  return self;
};
