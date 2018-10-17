const redis = require('redis');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const multerS3Transform = require('multer-s3-transform');
const pg = require('pg');
const config = require('./config/config');
const sharp = require('sharp');
const Hashids = require('hashids');

const hashids = new Hashids(config.id_hash, 10);

AWS.config.loadFromPath('./aws-config.json');

const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

var types = pg.types;
types.setTypeParser(1114, function(stringValue) {
    return new Date(stringValue + "+0000");
});


const pool = new pg.Pool({
    user: 'StoryflowUser',
    host: 'storyflow-db.cmzdhv5svqny.us-east-1.rds.amazonaws.com',
    database: 'storyflow_analytics',
    password: '2p20RuU1D',
    port: 5432
});

// Create a Redis Client for sessions
const redisClient = process.env.PROD ? redis.createClient({
    host: config.redisClusterHost,
    port: config.redisClusterPort
}) : redis.createClient();

const s3 = new AWS.S3();

const upload = multer({
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

module.exports = {
    upload: upload,
    docClient: docClient,
    pool: pool,
    redisClient: redisClient,
    jwt: jwt,
    config: config,
    s3: s3,
    uploadResize: uploadResize,
    hashids: hashids
}

