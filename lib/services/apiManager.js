'use strict';

const { check } = require('@voiceflow/common').utils;
const uuid = require('uuid/v4');

module.exports = function(services) {
  const self = {};

  check(services, '', 'object');
  check(services, 'pool', 'object');

  const { pool } = services;

  self.getToken = async (creatorId) => {
    const result = await pool.query('SELECT api_key FROM creators WHERE creator_id=$1', [creatorId]);
    if (result.rows.length === 0) throw new Error('Creator ID not found');
    if (result.rows[0].api_key) return result.rows[0].api_key;
    return self.genToken(creatorId);
  };

  self.getUser = async (token) => {
    const result = await pool.query('SELECT creator_id AS id, name, email, 0 AS admin FROM creators WHERE api_key=$1', [token]);
    return result.rows[0];
  };

  self.genToken = async (creatorId) => {
    const token = uuid();
    await pool.query('UPDATE creators SET api_key=$1 WHERE creator_id=$2', [token, creatorId]);
    return token;
  };

  return self;
};
