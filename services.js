const redis = process.env.TEST ? require("redis-mock") : require("redis");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const multerS3 = require("multer-s3");
const multerS3Transform = require("multer-s3-transform");
const pg = require("pg");
const config = require("./config/config");
const sharp = require("sharp");
const Hashids = require("hashids");
const Intercom = require("intercom-client");

const moment = require("moment");
const _ = require("lodash");
const StackTrace = require("stacktrace-js");

const hashids = new Hashids(process.env.CONFIG_ID_HASH, 10);
const MB = 1024 * 1024;

const AWS = require("aws-sdk");
AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT
});

const docClient = new AWS.DynamoDB.DocumentClient({
  convertEmptyValues: true
});

var types = pg.types;
types.setTypeParser(1114, function(stringValue) {
  return new Date(stringValue + "+0000");
});

const pool = new pg.Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DB,
  password: process.env.PSQL_PW,
  port: 5432
});

// Create a Redis Client for sessions
const redisClient =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
    ? redis.createClient({
        host: process.env.REDIS_CLUSTER_HOST,
        port: process.env.REDIS_CLUSTER_PORT
      })
    : redis.createClient();

const s3 = new AWS.S3();

const upload = multer({
  limits: {
    files: 1,
    filesize: 10 * MB
  },
  storage: multerS3({
    s3: s3,
    bucket: "com.getstoryflow.audio.production",
    key: (req, file, cb) => {
      cb(
        null,
        Date.now().toString() +
          "-" +
          file.originalname
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-.]+/g, "")
      );
    }
  })
});

const uploadResize = (x, y) => {
  return multer({
    limits: {
      files: 1,
      filesize: 5 * MB
    },
    storage: multerS3Transform({
      s3: s3,
      bucket: "com.getstoryflow.api.images",
      shouldTransform: function(req, file, cb) {
        cb(null, /^image/i.test(file.mimetype));
      },
      transforms: [
        {
          id: "image",
          key: function(req, file, cb) {
            let fileSplit = file.originalname.split(".");

            let filename =
              Date.now().toString() +
              "-" +
              fileSplit
                .slice(0, fileSplit.length - 1)
                .join(".")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w\-.]+/g, "") +
              ".png";

            cb(null, filename);
          },
          transform: function(req, file, cb) {
            cb(
              null,
              sharp()
                .resize(x, y)
                .png()
            );
          }
        }
      ]
    })
  });
};

const s3Stream = require("s3-upload-stream")(s3);

const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const logging_pool = new pg.Pool({
  user: process.env.LOGGING_USER,
  host: process.env.LOGGING_HOST,
  database: process.env.LOGGING_DB,
  password: process.env.LOGGING_PW,
  port: 5432
});

const verify = (auth, cb) => {
  if (typeof auth !== "string") {
    cb();
  } else {
    let userHash = auth.substring(0, 16);
    let token = auth.substring(16);
    if (!token || !userHash) {
      cb();
    } else {
      redisClient.get(userHash, function(err, secret) {
        if (err || !secret) {
          cb();
        } else {
          redisClient.expire(userHash, config.expire_time);
          jwt.verify(token, secret, (err, decoded) => {
            if (err) {
              cb();
            } else {
              cb({
                user: decoded,
                secret: secret,
                userHash: userHash
              });
            }
          });
        }
      });
    }
  }
};

const cloudWatchLogs = new AWS.CloudWatchLogs();
const writeToLogs = async (log_group, msg_details) => {
  if (/development/.test(process.env.NODE_ENV)) {
    console.log(log_group, msg_details);
    return;
  }
  try {
    let time = moment().format("MMM Do YY");
    let group = process.env[log_group];
    let stack_trace;

    try {
      stack_trace = await StackTrace.get();
    } catch (err) {
      stack_trace = "Unable to retrieve stack trace";
    }

    if (!group) {
      group = "DEV_server_errors";
    }

    if (msg_details.err && msg_details.err instanceof Error) {
      msg_details.err = msg_details.err.toString();
    }

    let streamExist = false;
    let msg = {
      timestamp: Date.now(),
      stack_trace: stack_trace,
      ...msg_details
    };

    if (process.env.NODE_ENV === "development" || "test") {
      console.log(`WRITING TO LOGS ${group}`, msg);
    }
    let name = `${time} ${stack_trace[1].fileName} ${Math.floor(
      Math.random() * 16777215
    ).toString(16)}`;
    let stream = {
      logGroupName: group,
      logStreamName: `${name}`
    };
    let params = {
      logGroupName: group,
      logStreamName: `${name}`,
      logEvents: [
        {
          message: JSON.stringify(msg),
          timestamp: Date.now()
        }
      ]
    };
    if (process.env.NODE_ENV !== "test") {
      try {
        await cloudWatchLogs.createLogStream(stream).promise();
      } catch (err) {
        console.trace(err);
      }
      cloudWatchLogs.putLogEvents(params, err => {
        if (err) {
          console.trace(err);
        }
      });
    }
  } catch (err) {
    // Do nothing, if logs fail it shouldn't affect runtime
    console.trace(err);
  }
};

const logAxiosError = (err, context = "", data = null) => {
  let msg = {};
  if (err && err.response) {
    msg = {
      context: context,
      err_response_data: err.response.data,
      err_response_status: err.response.status
    };
  } else if (context) {
    msg = {
      context: context,
      err: err
    };
  } else {
    msg = {
      err: err
    };
  }
  if (data) msg.data = data;
  writeToLogs("CREATOR_BACKEND_ERRORS", msg);
};

const encryptJSON = data => jwt.sign(data, process.env.JWT_SECRET);
const decryptJSON = token => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  upload: upload,
  docClient: docClient,
  pool: pool,
  redisClient: redisClient,
  jwt: jwt,
  config: config,
  s3: s3,
  s3Stream: s3Stream,
  uploadResize: uploadResize,
  hashids: hashids,
  validateEmail: validateEmail,
  logging_pool: logging_pool,
  verify: verify,
  logAxiosError: logAxiosError,
  writeToLogs: writeToLogs,
  encryptJSON: encryptJSON,
  decryptJSON: decryptJSON
};

// SECRET
if (process.env.NODE_ENV !== "test") {
  module.exports.intercom = new Intercom.Client({
    token: process.env.INTERCOM_TOKEN
  });
  module.exports.analytics = new (require("analytics-node"))(
    process.env.SEGMENT_WRITE_KEY
  );
}
