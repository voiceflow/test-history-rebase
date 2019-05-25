'use strict';

const Segement = require('analytics-node');
const randomstring = require('randomstring');
const axios = require('axios');
const bcrypt = require('bcrypt');
const _jwt = require('jsonwebtoken');

/* eslint-disable global-require */
module.exports = {
  JWT: require('./jwt'),
  Segement,
  MockSegement: require('./mockSegement'),
  staticClients: {
    axios,
    bcrypt,
    randomstring,
    _jwt,
  },
};
