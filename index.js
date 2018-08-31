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

// create SQL client for analytics
const { Pool } = require('pg');

const pool = new Pool({
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

app.use(express.static(path.join(__dirname, 'app', 'build')));

const Diagram = require('./diagram.js');
const Problem = require('./error.js');
const Audio = require('./audio.js');
const Story = require('./story.js');
const Analytics = require('./routes/analytics.js')(docClient, pool);
const Review = require('./routes/review.js')(docClient);

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
const ensureAdmin = () => {
    return (req, res, next) => {
        if(req.user && req.user.admin) next();
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
app.get('/diagram/:id', ensureLoggedIn(), Diagram.getDiagram);
app.delete('/diagram/:id', ensureLoggedIn(), Diagram.deleteDiagram);
app.post('/diagram', ensureLoggedIn(), Diagram.setDiagram);
app.post('/publish/:env/:id', ensureLoggedIn(), Diagram.publish);
app.post('/publish/review/:env/:id', ensureLoggedIn(), Diagram.publishReview);

app.get('/review/:id', ensureAdmin(), Review.getReview);
app.post('/review/:id', ensureLoggedIn(), Review.setReview);
app.post('/review', ensureLoggedIn(), Review.saveReview);
app.patch('/review/:id', ensureAdmin(), Review.updateReview);
app.delete('/review/:id', ensureLoggedIn(), Review.deleteReview);
app.get('/reviews', ensureLoggedIn(), Review.getReviews);

app.get('/analytics/:env/aggregate', ensureAdmin(), Analytics.getAggregate);
app.get('/analytics/:env/stories', ensureAdmin(), Analytics.getStories);
// app.get('/analytics/:env/users', ensureAdmin(), Analytics.getUsers);

// TO REMOVE SOON
app.get('/diagrams/:id', ensureLoggedIn(), Diagram.getDiagram);
app.post('/diagrams', ensureLoggedIn(), Diagram.setDiagram);
/* unRESTful STUFF TO REMOVE */

app.get('/stories/:env', Story.getStories);
app.post('/feature/:env/:id', ensureAdmin(), Story.featureStory);
app.delete('/stories/:env/:id', ensureAdmin(), Story.deleteStory);
app.post('/list/:env/:id', ensureAdmin(), Story.listStory);
app.delete('/list/:env/:id', ensureAdmin(), Story.unlistStory);

app.get('/errors/:env', ensureLoggedIn(), Problem.getErrors);

app.get('/voices', ensureLoggedIn(), Audio.getVoices);
app.post('/generate', ensureLoggedIn(), Audio.generate);
app.post('/audio', ensureLoggedIn(), upload.any(), Audio.upload);
app.post('/concat', ensureLoggedIn(), Audio.concat);

// all the authentication routes
const authentication = require('./routes/authentication')(express.Router(), docClient, redisClient);
app.use('/', authentication);

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
    res.redirect('/');
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'app', 'build', 'index.html'));
})

// eslint-disable-next-line no-console
app.listen(port, () => console.log(name + ' running on port ' + port));

