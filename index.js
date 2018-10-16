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
const fs = require('fs');
const https = require('https');

AWS.config.loadFromPath('./aws-config.json');

const docClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});

// create SQL client for analytics
const pg = require('pg');

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

app.use(express.static(path.join(__dirname, 'app', 'build')));

const Diagram = require('./routes/diagram.js')(docClient, pool);
const World = require('./routes/world.js')(docClient, pool);
const Skill = require('./routes/skill.js')(docClient, pool);
const Problem = require('./routes/error.js');
const Audio = require('./routes/audio.js');
const Story = require('./routes/story.js')(docClient, pool);
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

// Middleware for Authentication
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
                            req.secret = secret;
                            req.userHash = userHash;
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

app.get('/worlds', ensureLoggedIn(), World.getWorlds);
app.post('/world', ensureLoggedIn(), World.setWorld);
app.delete('/world/:id', ensureLoggedIn(), World.deleteWorld);
app.patch('/world/:id', ensureLoggedIn(), World.updateAudio);
app.get('/world/:id/stories', ensureLoggedIn(), World.getStories);

app.get('/skills', ensureLoggedIn(), Skill.getSkills);
app.get('/skill/:id', ensureLoggedIn(), Skill.getSkill);
app.post('/skill', ensureLoggedIn(), Skill.setSkill);
app.patch('/skill/:id', ensureLoggedIn(), Skill.patchSkill);
app.delete('/skill/:id', ensureLoggedIn(), Skill.deleteSkill);

app.get('/diagrams', ensureLoggedIn(), Diagram.getDiagrams);
app.get('/diagram/:id', ensureLoggedIn(), Diagram.getDiagram);
app.delete('/diagram/:id', ensureLoggedIn(), Diagram.deleteDiagram);
app.post('/diagram', ensureLoggedIn(), Diagram.setDiagram);
app.post('/publish/:env/:id', ensureLoggedIn(), Diagram.publish);
app.post('/publish/review/:env/:id', ensureLoggedIn(), Diagram.publishReview);
app.post('/publish/world/:world_id/:id', ensureLoggedIn(), Diagram.publishWorld);

app.get('/review/:id', ensureAdmin(), Review.getReview);
app.post('/review/:id', ensureLoggedIn(), Review.setReview);
app.post('/review', ensureLoggedIn(), Review.saveReview);
app.patch('/review/:id', ensureAdmin(), Review.updateReview);
app.delete('/review/:id', ensureLoggedIn(), Review.deleteReview);
app.get('/reviews', ensureLoggedIn(), Review.getReviews);

app.get('/analytics/:env/aggregate', ensureAdmin(), Analytics.getAggregate);
app.get('/analytics/:env/stories', ensureAdmin(), Analytics.getStories);
app.get('/analytics/:env/stories/:start/:end', ensureAdmin(), Analytics.getStories);
app.get('/analytics/:env/reads/', ensureAdmin(), Analytics.getReads);
app.get('/analytics/:env/reads/:start/:end', ensureAdmin(), Analytics.getReads);
app.get('/analytics/:env/users', ensureAdmin(), Analytics.getUsers);
app.get('/analytics/:env/users/bucket', ensureAdmin(), Analytics.getBucketUsers);
app.get('/analytics/:env/user/:id/stories', ensureAdmin(), Analytics.getUserStories);
app.get('/analytics/:env/user/:id/stories/data', ensureAdmin(), Analytics.getUserStoriesData);
app.get('/analytics/story/:id/lines', ensureAdmin(), Analytics.getStoryLines);

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
app.post('/image', ensureLoggedIn(), upload.any(), (req, res) => {
    res.send('https://s3.amazonaws.com/com.getstoryflow.audio.production/'+req.files[0].key);
});
app.post('/concat', ensureLoggedIn(), Audio.concat);

// all the authentication routes
const authentication = require('./routes/authentication')(express.Router(), docClient, pool, redisClient);
app.use('/', authentication);

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app', 'build', 'index.html'));
});

// eslint-disable-next-line no-console
// eslint-disable-next-line no-console
if(process.env.SECURE){
    var options = {
        key: fs.readFileSync('config/server.key'),
        cert: fs.readFileSync('config/server.crt'),
    };
    https.createServer(options, app).listen(443);
}else{
    app.listen(port, () => console.log(name + ' running on port ' + port));
}

