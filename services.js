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

const hashids = new Hashids(config.id_hash, 10);
const MB = 1024*1024

const AWS = require('aws-sdk'); 
AWS.config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
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
const redisClient = (process.env.PROD || process.env.STAGING ) ? redis.createClient({
    host: config.redisClusterHost,
    port: config.redisClusterPort
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
const intercom_client = new Intercom.Client({ token: process.env.INTERCOM_TOKEN })

const logging_pool = new pg.Pool({
    user: process.env.LOGGING_USER,
    host: process.env.LOGGING_HOST,
    database: process.env.LOGGING_DB,
    password: process.env.LOGGING_PW,
    port: 5432
})

module.exports = {
    intercom: intercom_client,
    upload: upload,
    docClient: docClient,
    pool: pool,
    redisClient: redisClient,
    jwt: jwt,
    config: config,
    s3: s3,
    uploadResize: uploadResize,
    hashids: hashids,
    validateEmail: validateEmail,
    logging_pool: logging_pool
}

