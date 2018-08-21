#!/usr/bin/env node
const npmPackage = require('./package.json');

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const config = require('./config/config');
const redis = require('redis');

AWS.config.loadFromPath('./aws-config.json');

const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
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

app.use(express.static(path.join(__dirname, 'app', 'build')));

const Diagram = require('./diagram.js');
const Problem = require('./error.js');
const Audio = require('./audio.js');
const Story = require('./story.js');

const port = 8080;
const name = npmPackage.name+' v'+npmPackage.version;

app.use(cors());
app.use(helmet());

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(cookieParser());

app.use((req, res, next) => {
    if(!req.cookies.auth){
        next();
    }else {
        let userHash = req.cookies.auth.substring(0,16);
        let token = req.cookies.auth.substring(16);
        if (!token || !userHash) {
            next();
        } else {
            redisClient.get(userHash, function(err, secret) {
                if (err) {
                    next();
                } else if (!secret) {
                    next();
                } else {
                    redisClient.expire(userHash, config.expire_time);
                    jwt.verify(token, secret, (err, decoded) => {
                        if (err) {
                            next();
                        } else {
                            req.user = decoded;
                            next();
                        }
                    });
                }
            });
        }
    }
});

const ensureLoggedIn = () => {
    return (req, res, next) => {
        if(req.user) next();
        else res.sendStatus(401);
    }
}
const ensureLoggedOut = () => {
    return (req, res, next) => {
        if(req.user) res.redirect('/');
        else next();
    }
}

app.get('/diagrams', ensureLoggedIn(), Diagram.getDiagrams);
app.get('/diagrams/:id', ensureLoggedIn(), Diagram.getDiagram);
app.delete('/diagrams/:id', ensureLoggedIn(), Diagram.deleteDiagram);
app.post('/diagrams', ensureLoggedIn(), Diagram.setDiagram);
app.post('/publish/:env/:id', ensureLoggedIn(), Diagram.publish);

app.get('/stories/:env', Story.getStories);
app.post('/feature/:env/:id', ensureLoggedIn(), Story.featureStory);
app.delete('/stories/:env/:id', ensureLoggedIn(), Story.deleteStory);

app.get('/errors/:env', ensureLoggedIn(), Problem.getErrors);

app.get('/voices', ensureLoggedIn(), Audio.getVoices);
app.post('/generate', ensureLoggedIn(), Audio.generate);
app.post('/audio', ensureLoggedIn(), upload.any(), Audio.upload);

// all the authentication routes
const authentication = require('./routes/authentication')(express.Router(), docClient, redisClient);
app.use('/', authentication);

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app', 'build', 'index.html'));
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(name + ' running on port ' + port));

