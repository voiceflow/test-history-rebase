#!/usr/bin/env node
const npmPackage = require('./package.json');
  
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const {upload, uploadResize, redisClient, jwt, config} = require('./services');

// IMPORT ROUTES
const Diagram = require('./routes/diagram.js');
const Skill = require('./routes/skill.js');
const Problem = require('./routes/error.js');
const Audio = require('./routes/audio.js');
const Analytics = require('./routes/analytics.js')
const Review = require('./routes/review.js');
const Authentication = require('./routes/authentication');
const Code = require('./config/codes.js');
const Decode = require('./routes/decode.js');
const Marketplace = require('./routes/marketplace.js');
const Email = require('./routes/email.js');
const Onboard = require('./routes/onboard.js');

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

app.use(express.static(path.join(__dirname, 'app', 'build')));

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
        if(req.user && req.user.admin===10) next();
        else res.sendStatus(401);
    }
}
const ensureLoggedOut = () => {
    return (req, res, next) => {
        if(req.user) res.redirect('/');
        else next();
    }
}

app.get('/session/amazon/access_token', ensureLoggedIn(), Authentication.hasAccessToken);
app.get('/session/amazon/:code', ensureLoggedIn(), Authentication.getAmazonCode);
app.get('/session', Authentication.getSession);
app.get('/session/vendor', ensureLoggedIn(), Authentication.getVendor);
app.put('/session', Authentication.putSession);
app.delete('/session', Authentication.deleteSession);
app.put('/user', Authentication.putUser);
app.post('/user/reset', Authentication.resetPasswordEmail);
app.get('/user/reset/:token', Authentication.checkReset);
app.post('/user/reset/:token', Authentication.resetPassword);
app.post('/user/reset/password', Authentication.resetPassword);
app.get('/decode/:id', ensureAdmin(),Decode.decodeId);
app.get('/encode/:id', ensureAdmin(),Decode.encodeId);

app.get('/email/templates', ensureLoggedIn(), Email.getTemplates);
app.get('/email/template/:id', ensureLoggedIn(), Email.getTemplate);
app.post('/email/template', ensureLoggedIn(), Email.setTemplate);
app.patch('/email/template/:id', ensureLoggedIn(), Email.setTemplate);
app.delete('/email/template/:id', ensureLoggedIn(), Email.deleteTemplate);

app.get('/skills', ensureLoggedIn(), Skill.getSkills);
app.get('/skill/:id', ensureLoggedIn(), Skill.getSkill);
app.get('/skill/:id/diagrams', ensureLoggedIn(), Skill.getDiagrams);
app.post('/skill', ensureLoggedIn(), Skill.setSkill);
app.post('/skill/:id/publish', ensureLoggedIn(), Skill.buildSkill);
app.post('/amazon/:amzn_id/certify', ensureLoggedIn(), Skill.certifySkill);
app.post('/amazon/:amzn_id/withdraw', ensureLoggedIn(), Skill.withdrawSkill);
app.patch('/skill/:id', ensureLoggedIn(), Skill.patchSkill);
app.delete('/skill/:id', ensureLoggedIn(), Skill.deleteSkill);

app.get('/diagrams', ensureLoggedIn(), Diagram.getDiagrams);
app.get('/diagram/:id', ensureLoggedIn(), Diagram.getDiagram);
app.get('/diagram/:id/variables', ensureLoggedIn(), Diagram.getVariables);
app.delete('/diagram/:id', ensureLoggedIn(), Diagram.deleteDiagram);
app.post('/diagram', ensureLoggedIn(), Diagram.setDiagram);
app.post('/diagram/:id/name', ensureLoggedIn(), Diagram.updateName);
app.post('/diagram/:diagram_id/test/publish', ensureLoggedIn(), Diagram.publishTest);
app.post('/diagram/:diagram_id/:skill_id/publish', ensureLoggedIn(), Diagram.publish);
app.get('/diagram/copy/:diagram_id', ensureLoggedIn(), Diagram.copyDiagram)

// app.get('/analytics/:env/aggregate', ensureAdmin(), Analytics.getAggregate);
// app.get('/analytics/:skill_id/totalUsers', ensureAdmin(), Analytics.getTotalUsers);
// app.get('/analytics/:skill_id/weekly', ensureAdmin(), Analytics.getWeeklyUsers);
// app.get('/analytics/:skill_id/monthly', ensureAdmin(), Analytics.getMonthlyUsers);
// app.get('/analytics/:skill_id/sessions', ensureAdmin(), Analytics.getSessions);
// app.get('/analytics/:env/stories', ensureAdmin(), Analytics.getStories);
// app.get('/analytics/:env/stories/:start/:end', ensureAdmin(), Analytics.getStories);
// app.get('/analytics/:env/reads/', ensureAdmin(), Analytics.getReads);
// app.get('/analytics/:env/reads/:start/:end', ensureAdmin(), Analytics.getReads);
// app.get('/analytics/:env/users', ensureAdmin(), Analytics.getUsers);
// app.get('/analytics/:env/users/bucket', ensureAdmin(), Analytics.getBucketUsers);
// app.get('/analytics/:env/user/:id/stories', ensureAdmin(), Analytics.getUserStories);
// app.get('/analytics/:env/user/:id/stories/data', ensureAdmin(), Analytics.getUserStoriesData);
// app.get('/analytics/story/:id/lines', ensureAdmin(), Analytics.getStoryLines);

app.get('/marketplace', ensureLoggedIn(), Marketplace.getModules);
app.get('/marketplace/featured', ensureLoggedIn(), Marketplace.getFeaturedModules);
app.get('/marketplace/user_module', ensureLoggedIn(), Marketplace.getUserModules);
app.get('/marketplace/:module_id', ensureLoggedIn(), Marketplace.getModule);
app.get('/marketplace/cert/status/:skill_id', ensureLoggedIn(), Marketplace.certStatus);
app.get('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.getCertModule);
app.post('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.requestCertification);
//!!!! TODO: REMOVE DUE TO TESTING !!!!
//app.put('/marketplace/cert/:skill_id', ensureAdmin(), Marketplace.giveCertification);
app.put('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.giveCertification);
app.delete('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.cancelCertification);
app.patch('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.saveCertification);
app.post('/marketplace/user_module/:module_id', ensureLoggedIn(), Marketplace.giveAccess);
app.get('/marketplace/user_module/:module_id', ensureLoggedIn(), Marketplace.hasAccess);
app.delete('/marketplace/user_module/:module_id', ensureLoggedIn(), Marketplace.removeAccess);
app.get('/marketplace/template/:module_id', ensureLoggedIn(), Marketplace.retrieveTemplate);

app.get('/onboard', ensureLoggedIn(), Onboard.checkIfOnboarded);
app.post('/onboard', ensureLoggedIn(), Onboard.submitOnboardSurvey);

app.get('/codes/:num', ensureAdmin(), Code.endpoint);

app.get('/errors/:env', ensureLoggedIn(), Problem.getErrors);

app.get('/voices', ensureLoggedIn(), Audio.getVoices);
app.post('/generate', ensureLoggedIn(), Audio.generate);
app.post('/audio', ensureLoggedIn(), upload.single('audio'), Audio.upload);

app.post('/raw_audio', ensureLoggedIn(), upload.single('audio'), (req, res) => {
    res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${req.file.key}`);
});

app.post('/image/large_icon', uploadResize(512,512).single('image'), (req, res) => {
    let filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
});
app.post('/image/small_icon', uploadResize(108,108).single('image'), (req, res) => {
    let filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
});
app.post('/image/module_icon', uploadResize(40,40).single('image'), (req, res) => {
    let filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
});
app.post('/image/card_icon', uploadResize(108,108).single('image'), (req, res) => {
    let filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
});

app.post('/image', ensureLoggedIn(), upload.any(), (req, res) => {
    res.send('https://s3.amazonaws.com/com.getstoryflow.audio.production/'+req.files[0].key);
});

app.post('/concat', ensureLoggedIn(), Audio.concat);

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

