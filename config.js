'use strict';

const { getProcessEnv, hasProcessEnv } = require('@voiceflow/common').utils;

const optionalProcessEnv = (name) => (hasProcessEnv(name) ? getProcessEnv(name) : null);

module.exports = {
  NODE_ENV: getProcessEnv('NODE_ENV'),
  JWT_SECRET: getProcessEnv('JWT_SECRET'),
  CONFIG_CLIENT_ID: getProcessEnv('CONFIG_CLIENT_ID'),
  CONFIG_CLIENT_SECRET: getProcessEnv('CONFIG_CLIENT_SECRET'),
  GOOGLE_ID: getProcessEnv('GOOGLE_ID'),
  APP_TOKEN: optionalProcessEnv('APP_TOKEN'),
  SEGMENT_WRITE_KEY: optionalProcessEnv('SEGEMENT_WRITE_KEY'),
  AWS_ACCESS_KEY_ID: getProcessEnv('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: getProcessEnv('AWS_SECRET_ACCESS_KEY'),
  AWS_REGION: getProcessEnv('AWS_REGION'),
  AWS_ENDPOINT: optionalProcessEnv('AWS_ENDPOINT'),
  SENDGRID_KEY: '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',
};
