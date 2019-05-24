'use strict';

const { check } = require('@voiceflow/common').utils;

module.exports = function(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'apijwt', 'object');
  check(services, 'pool', 'object');

  const { apijwt, pool } = services;

  self.getToken = async (creatorId) => {
    return apijwt.sign(creatorId);
  };

  self.getUser = async (token) => {
    const creatorId = apijwt.verify(token);
    const result = await pool.query('SELECT name, email FROM creators WHERE creator_id=$1', [creatorId]);
    return result.rows[0];
  };

  return self;
};
