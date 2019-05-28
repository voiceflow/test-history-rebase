'use strict';

// eslint-disable-next-line
const Redis = process.env.TEST ? require('ioredis-mock') : require('ioredis');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const multerS3Transform = require('multer-s3-transform');
const pg = require('pg');
const sharp = require('sharp');
const Hashids = require('hashids');
const Intercom = require('intercom-client');
const elasticsearch = require('elasticsearch');
const AWS = require('aws-sdk');
const moment = require('moment');
const StackTrace = require('stacktrace-js');
const s3UploadStream = require('s3-upload-stream');
const httpAwsEs = require('http-aws-es');
const Analytics = require('analytics-node');
const axios = require('axios');

const config = require('./config/config');
const log = require('./logger');

const hashids = new Hashids(process.env.CONFIG_ID_HASH, 10);
const MB = 1024 * 1024;

AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
});

// AWS does some hasOwnProperty check so only define endpoint if set
const docClient = process.env.DYNAMO_ENDPOINT
  ? new AWS.DynamoDB.DocumentClient({
      convertEmptyValues: true,
      endpoint: process.env.DYNAMO_ENDPOINT,
    })
  : new AWS.DynamoDB.DocumentClient({
      convertEmptyValues: true,
    });

const { types } = pg;
types.setTypeParser(1114, (stringValue) => new Date(`${stringValue}+0000`));

const pool = new pg.Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DB,
  password: process.env.PSQL_PW,
  port: 5432,
});

// Create a Redis Client for sessions
const redis =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
    ? new Redis({
        host: process.env.REDIS_CLUSTER_HOST,
        port: process.env.REDIS_CLUSTER_PORT,
      })
    : new Redis();

const s3 = new AWS.S3();

const upload = multer({
  limits: {
    files: 1,
    filesize: 10 * MB,
  },
  storage: multerS3({
    s3,
    bucket: 'com.getstoryflow.audio.production',
    key: (req, file, cb) => {
      cb(
        null,
        `${Date.now().toString()}-${file.originalname
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-.]+/g, '')}`
      );
    },
  }),
});

const uploadResize = (x, y) =>
  multer({
    limits: {
      files: 1,
      filesize: 5 * MB,
    },
    storage: multerS3Transform({
      s3,
      bucket: 'com.getstoryflow.api.images',
      shouldTransform(req, file, cb) {
        cb(null, /^image/i.test(file.mimetype));
      },
      transforms: [
        {
          id: 'image',
          key(req, file, cb) {
            const fileSplit = file.originalname.split('.');

            const filename = `${Date.now().toString()}-${fileSplit
              .slice(0, fileSplit.length - 1)
              .join('.')
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w\-.]+/g, '')}.png`;

            cb(null, filename);
          },
          transform(req, file, cb) {
            cb(
              null,
              sharp()
                .resize(x, y)
                .png()
            );
          },
        },
      ],
    }),
  });

const s3Stream = s3UploadStream(s3);

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const logging_pool = new pg.Pool({
  user: process.env.LOGGING_USER,
  host: process.env.LOGGING_HOST,
  database: process.env.LOGGING_DB,
  password: process.env.LOGGING_PW,
  port: 5432,
});

const verify = (auth, cb) => {
  if (typeof auth !== 'string') {
    return cb();
  }
  const userHash = auth.substring(0, 16);
  const token = auth.substring(16);
  if (!token || !userHash) {
    return cb();
  }
  return redis.get(userHash, (err, secret) => {
    if (err || !secret) {
      return cb();
    }
    redis.expire(userHash, config.expire_time);
    return jwt.verify(token, secret, (_err, decoded) => {
      if (_err) {
        return cb();
      }
      return cb({
        user: decoded,
        secret,
        userHash,
      });
    });
  });
};

const cloudWatchLogs = new AWS.CloudWatchLogs();
const writeToLogs = async (log_group, msg_details) => {
  if (/development|local/.test(process.env.NODE_ENV) || process.env.NODE_ENV === 'test') {
    log.info(log_group, msg_details);
    return;
  }
  try {
    const time = moment().format('MMM Do YY');
    let group = process.env[log_group];
    let stack_trace;

    try {
      stack_trace = await StackTrace.get();
    } catch (err) {
      stack_trace = 'Unable to retrieve stack trace';
    }

    if (!group) {
      group = 'DEV_server_errors';
    }

    if (msg_details.err && msg_details.err instanceof Error) {
      msg_details.err = msg_details.err.toString();
    }

    const msg = {
      timestamp: Date.now(),
      stack_trace,
      ...msg_details,
    };

    if (process.env.NODE_ENV === 'development' || 'test') {
      log.info(`WRITING TO LOGS ${group}`, msg);
    }
    const name = `${time} ${stack_trace[1].fileName} ${Math.floor(Math.random() * 16777215).toString(16)}`;
    const stream = {
      logGroupName: group,
      logStreamName: `${name}`,
    };
    const params = {
      logGroupName: group,
      logStreamName: `${name}`,
      logEvents: [
        {
          message: JSON.stringify(msg),
          timestamp: Date.now(),
        },
      ],
    };
    if (process.env.NODE_ENV !== 'test') {
      try {
        await cloudWatchLogs.createLogStream(stream).promise();
      } catch (err) {
        log.trace(err);
      }
      cloudWatchLogs.putLogEvents(params, (err) => {
        if (err) {
          log.trace(err);
        }
      });
    }
  } catch (err) {
    // Do nothing, if logs fail it shouldn't affect runtime
    log.trace(err);
  }
};

const logAxiosError = (err, context = '', data = null) => {
  let msg = {};
  if (err && err.response) {
    msg = {
      context,
      err_response_data: err.response.data,
      err_response_status: err.response.status,
    };
  } else if (context) {
    msg = {
      context,
      err,
    };
  } else {
    msg = {
      err,
    };
  }
  if (data) msg.data = data;
  writeToLogs('CREATOR_BACKEND_ERRORS', msg);
};

const ESoptions =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
    ? {
        hosts: [process.env.ELASTIC_SEARCH_HOST],
        connectionClass: httpAwsEs,
        awsConfig: AWS.config,
      }
    : {
        host: 'localhost:9200',
      };

const ESclient = elasticsearch.Client(ESoptions);

const setupESIndices = async () => {
  try {
    const res = await ESclient.indices.create({
      index: 'marketplace',
    });
    log.info('marketplace index', res);
  } catch (err) {
    log.info('marketplace index already exists');
  }
};

setupESIndices();

const encryptJSON = (data) => jwt.sign(data, process.env.JWT_SECRET);
const decryptJSON = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  axios,
  upload,
  docClient,
  pool,
  redis,
  redisClient: redis,
  jwt,
  config,
  s3,
  s3Stream,
  uploadResize,
  hashids,
  validateEmail,
  logging_pool,
  verify,
  logAxiosError,
  writeToLogs,
  ESclient,
  encryptJSON,
  decryptJSON,
};

// SECRET
if (process.env.NODE_ENV !== 'test') {
  module.exports.intercom = new Intercom.Client({
    token: process.env.INTERCOM_TOKEN,
  });
  module.exports.analytics = new Analytics(process.env.SEGMENT_WRITE_KEY);
} else {
  const testTrack = () => {
    //
  };
  module.exports.analytics = {
    track: testTrack,
  };
}
