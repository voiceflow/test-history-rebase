const redis = require('redis');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const pg = require('pg');
const config = require('./config/config');

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

module.exports = {
    upload: upload,
    docClient: docClient,
    pool: pool,
    redisClient: redisClient,
    jwt: jwt,
    config: config
}

