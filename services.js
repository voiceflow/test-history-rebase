const redis = require('redis');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const multerS3Transform = require('multer-s3-transform');
const pg = require('pg');
const config = require('./config/config');
const sharp = require('sharp');
const Hashids = require('hashids');
const Intercom = require('intercom-client');
const { getEnvVariable } = require('./util')
const moment = require('moment')
const _ = require('lodash')
const StackTrace = require('stacktrace-js')

const hashids = new Hashids(getEnvVariable('CONFIG_ID_HASH'), 10);
const MB = 1024*1024

const AWS = require('aws-sdk'); 
AWS.config = new AWS.Config({
    accessKeyId: getEnvVariable('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVariable('AWS_SECRET_ACCESS_KEY'),
    region: getEnvVariable('AWS_REGION'),
    endpoint: getEnvVariable('AWS_ENDPOINT')
});


const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

var types = pg.types;
types.setTypeParser(1114, function(stringValue) {
    return new Date(stringValue + "+0000");
});


const pool = new pg.Pool({
    user: getEnvVariable('PSQL_USER'),
    host: getEnvVariable('PSQL_HOST'),
    database: getEnvVariable('PSQL_DB'),
    password: getEnvVariable('PSQL_PW'),
    port: 5432
});

// Create a Redis Client for sessions
const redisClient = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') ? redis.createClient({
    host: getEnvVariable('REDIS_CLUSTER_HOST'),
    port: getEnvVariable('REDIS_CLUSTER_PORT')
}) : redis.createClient();

const s3 = new AWS.S3();

const upload = multer({
    limits: {
        files: 1,
        filesize: 10*MB
    },
    storage: multerS3({
        s3: s3,
        bucket: 'com.getstoryflow.audio.production',
        key: (req, file, cb) => {
            cb(null, Date.now().toString()+'-'+file.originalname
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-.]+/g, ''));
        }
    })
});

const uploadResize = (x, y) => {
    return multer({
        limits: {
            files: 1,
            filesize: 5*MB
        },
        storage: multerS3Transform({
            s3: s3,
            bucket: 'com.getstoryflow.api.images',
            shouldTransform: function (req, file, cb) {
                cb(null, /^image/i.test(file.mimetype))
            },
            transforms: [{
                id: 'image',
                key: function (req, file, cb) {

                    let fileSplit = file.originalname.split('.');

                    let filename = (Date.now().toString()+
                        '-'+
                        (fileSplit.slice(0, fileSplit.length - 1)
                        .join('.')
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w\-.]+/g, ''))) + '.png'

                    cb(null, filename);
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(x, y).png())
                }
            }]
        })
    })
}

const s3Stream = require('s3-upload-stream')(s3);

const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// SECRET
const intercom_client = new Intercom.Client({ token: getEnvVariable('INTERCOM_TOKEN') })

const logging_pool = new pg.Pool({
    user: getEnvVariable('LOGGING_USER'),
    host: getEnvVariable('LOGGING_HOST'),
    database: getEnvVariable('LOGGING_DB'),
    password: getEnvVariable('LOGGING_PW'),
    port: 5432
})

const verify = (auth, cb) => {
    if(typeof auth !== 'string'){
        cb()
    }else {
        let userHash = auth.substring(0,16)
        let token = auth.substring(16)
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
                            })
                        }
                    })
                }
            })
        }
    }
}

const cloudWatchLogs = new AWS.CloudWatchLogs();
const writeToLogs = async (log_group, msg_details) => {
    if(/development/.test(process.env.NODE_ENV)){
        console.log(msg_details)
        return
    }
    try {
        let time = moment().format('MMM Do YY')
        let group = getEnvVariable(log_group);
        let stack_trace

        try {
            stack_trace = await StackTrace.get()
        } catch (err) {
            stack_trace = "Unable to retrieve stack trace"
        }

        if(!group){
            group = 'DEV_server_errors'
        }

        if(msg_details.err && msg_details.err instanceof Error) {
            msg_details.err = msg_details.err.toString()
        }

        let streamExist = false
        let msg = {
            timestamp: Date.now(),
            stack_trace: stack_trace,
            ...msg_details
        }

        if(process.env.NODE_ENV === 'development'){
            console.log(`WRITING TO LOGS ${group}`, msg)
            // console.log(stack_trace)
        }
        let name = `${time} ${stack_trace[1].fileName} ${Math.floor(Math.random()*16777215).toString(16)}`
        let stream = {
            logGroupName: group,
            logStreamName: `${name}`
        }
        let params = {
            logGroupName: group,
            logStreamName: `${name}`,
            logEvents: [
                {
                    message: JSON.stringify(msg),
                    timestamp: Date.now()
                }
            ]
        }
        try {
            await cloudWatchLogs.createLogStream(stream).promise()
        } catch (err) {
            console.trace(err);
        }
        cloudWatchLogs.putLogEvents(params, (err) => {
            if (err) {
                console.trace(err);
            } 
        })
    } catch (err) {
        // Do nothing, if logs fail it shouldn't affect runtime
        console.trace(err)
    }
}

const logAxiosError = (err, context='', data=null) => {
    let msg = {}
    if(err && err.response){   
      msg = {
          context: context,
          err_response_data: err.response.data,
          err_response_status: err.response.status
      }
    }else if(context){
      msg = {
          context: context,
          err: err
      }
    }else{
      msg = {
          err: err
      }
    }
    if(data) msg.data = data
    writeToLogs('CREATOR_BACKEND_ERRORS', msg)
}

module.exports = {
    intercom: intercom_client,
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
    writeToLogs: writeToLogs
}

