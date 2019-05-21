'use strict';

const fs = require('fs');
const dotenv = require('dotenv');
const log = require('./logger');

if (process.env.NODE_ENV && fs.existsSync(`./.env.${process.env.NODE_ENV}`)) {
  if (process.env.NODE_ENV !== 'test') log.info(`Running in ${process.env.NODE_ENV} environment`);
  dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });
} else if (fs.existsSync('./.env')) {
  log.info('No Environment Set/Not Found! Running default .env file');
  dotenv.config();
} else {
  log.info('No Environment Set/Not Found! Hope you have your environment declared :O');
}
