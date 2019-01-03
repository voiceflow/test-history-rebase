#!/usr/bin/env node
require('dotenv').config()
// eslint-disable-next-line no-console
console.log(`Running in ${process.env.ENV} environment`)

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
const Customer = require('./routes/customer.js');
const Skill = require('./routes/skill.js');
const Problem = require('./routes/error.js');
const Audio = require('./routes/audio.js');
const Test = require('./routes/test.js');
const Authentication = require('./routes/authentication');
const Code = require('./config/codes.js');
const Decode = require('./routes/decode.js');
const Marketplace = require('./routes/marketplace.js');
const Email = require('./routes/email.js');
const Multimodal = require('./routes/multimodal/multimodal')
const Onboard = require('./routes/onboard.js');

const port = 8080;
const name = npmPackage.name+' v'+npmPackage.version;

app.use(cors())

app.use(helmet())

const rawBodyPaths = ['/customer/webhook']
const getRawBody = () => {
    return (req, res, next) => {
        if(rawBodyPaths.includes(req.path)){
            return bodyParser.json({
                verify: function (req, res, buf, encoding) {
                    req.rawBody = buf;
                }
            })(req, res, next)
        }else{
            return next()
        }
    };
};

app.use(getRawBody())

app.use(bodyParser.json({
    limit: '50mb'
}))
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}))

app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'app', 'build')))

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
const ensurePlan = plan => {
    return (req, res, next) => {
        if(req.user && req.user.admin>=plan) next();
        else res.sendStatus(401);
    }
}
const ensureAdmin = () => {
    return ensurePlan(100);
}
const ensureLoggedOut = () => {
    return (req, res, next) => {
        if(req.user) res.redirect('/');
        else next();
    }
}

app.get('/session/amazon/access_token', ensureLoggedIn(), Authentication.hasAccessToken);
app.get('/session/amazon/:code', ensureLoggedIn(), Authentication.getAmazonCode);
app.delete('/session/amazon', ensureLoggedIn(), Authentication.deleteAmazon);
app.get('/session', Authentication.getSession);
app.get('/session/vendor', ensureLoggedIn(), Authentication.getVendor);
app.put('/session', Authentication.putSession);
app.delete('/session', Authentication.deleteSession);
app.get('/user', ensureLoggedIn(), Authentication.getUser)
app.put('/user', Authentication.putUser);
app.post('/user/reset', Authentication.resetPasswordEmail);
app.get('/user/reset/:token', Authentication.checkReset);
app.post('/user/reset/:token', Authentication.resetPassword);
app.post('/user/reset/password', Authentication.resetPassword);
app.get('/decode/:id', ensureAdmin(),Decode.decodeId);
app.get('/encode/:id', ensureAdmin(),Decode.encodeId);

app.get('/business', ensurePlan(1));
app.get('/business/*', ensurePlan(1));

app.post('/test/api', ensureLoggedIn(), Test.api)

app.get('/email/templates', ensurePlan(1), Email.getTemplates);
app.get('/email/template/:id', ensurePlan(1), Email.getTemplate);
app.post('/email/template', ensurePlan(1), Email.setTemplate);
app.patch('/email/template/:id', ensurePlan(1), Email.setTemplate);
app.delete('/email/template/:id', ensurePlan(1), Email.deleteTemplate);

app.get('/multimodal/displays', ensureLoggedIn(), Multimodal.getDisplays);
app.get('/multimodal/display/:id', ensureLoggedIn(), Multimodal.getDisplay);
app.post('/multimodal/display', ensureLoggedIn(), Multimodal.setDisplay);
app.patch('/multimodal/display/:id', ensureLoggedIn(), Multimodal.setDisplay);
app.delete('/multimodal/display/:id', ensureLoggedIn(), Multimodal.deleteDisplay);
app.post('/multimodal/display/render/:id', ensureLoggedIn(), Multimodal.renderDisplay);

app.get('/skills', ensureLoggedIn(), Skill.getSkills);
app.get('/skill/:id', ensureLoggedIn(), Skill.getSkill);
app.get('/skill/:id/diagrams', ensureLoggedIn(), Skill.getDiagrams);
app.post('/skill/:id/:target_creator/copy', ensureLoggedIn(), Skill.copySkill)
app.post('/skill', ensureLoggedIn(), Skill.setSkill);
app.post('/skill/:id/publish', ensureLoggedIn(), Skill.buildSkill);
app.post('/amazon/:amzn_id/certify', ensureLoggedIn(), Skill.certifySkill);
app.post('/amazon/:amzn_id/withdraw', ensureLoggedIn(), Skill.withdrawSkill);
app.patch('/skill/:id', ensureLoggedIn(), Skill.patchSkill);
app.delete('/skill/:id', ensureLoggedIn(), Skill.deleteSkill);

// STRIPE PAYMENT ENDPOINTS
app.post('/customer/subscription', ensureLoggedIn(), Customer.create);
app.post('/customer/webhook', Customer.webhook);

app.get('/diagrams', ensureLoggedIn(), Diagram.getDiagrams);
app.get('/diagram/:id', ensureLoggedIn(), Diagram.getDiagram);
app.get('/diagram/:id/variables', ensureLoggedIn(), Diagram.getVariables);
app.delete('/diagram/:id', ensureLoggedIn(), Diagram.deleteDiagram);
app.post('/diagram', ensureLoggedIn(), Diagram.setDiagram);
app.post('/diagram/:id/name', ensureLoggedIn(), Diagram.updateName);
app.post('/diagram/:diagram_id/test/publish', ensureLoggedIn(), Diagram.publishTest);
app.post('/diagram/:diagram_id/:skill_id/publish', ensureLoggedIn(), Diagram.publish);
app.get('/diagram/copy/:diagram_id', ensureLoggedIn(), Diagram.copyDiagram)

app.get('/marketplace', ensureLoggedIn(), Marketplace.getModules)
app.get('/marketplace/featured', ensureLoggedIn(), Marketplace.getFeaturedModules)
app.get('/marketplace/user_module', ensureLoggedIn(), Marketplace.getUserModules)
app.get('/marketplace/:module_id', ensureLoggedIn(), Marketplace.getModule)
app.get('/marketplace/cert/pending', ensureAdmin(), Marketplace.getPendingModules)
app.get('/marketplace/cert/status/:skill_id', ensureLoggedIn(), Marketplace.certStatus)
app.get('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.getCertModule)
app.post('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.requestCertification)
app.put('/marketplace/cert/:skill_id', ensureAdmin(), Marketplace.giveCertification)
app.delete('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.cancelCertification)
app.patch('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.saveCertification)
app.post('/marketplace/user_module/:module_id', ensureLoggedIn(), Marketplace.giveAccess)
app.get('/marketplace/user_module/:module_id', ensureLoggedIn(), Marketplace.hasAccess)
app.delete('/marketplace/user_module/:module_id', ensureLoggedIn(), Marketplace.removeAccess)
app.get('/marketplace/template/:module_id', ensureLoggedIn(), Marketplace.retrieveTemplate)

app.get('/onboard', ensureLoggedIn(), Onboard.checkIfOnboarded);
app.post('/onboard', ensureLoggedIn(), Onboard.submitOnboardSurvey);

app.get('/admin', ensureAdmin());
app.get('/admin/*', ensureAdmin());

app.get('/codes/:num', ensureAdmin(), Code.endpoint);

app.get('/errors/:env', ensureLoggedIn(), Problem.getErrors);

app.get('/voices', ensureLoggedIn(), Audio.getVoices);
// app.post('/generate', ensureLoggedIn(), Audio.generate);
app.post('/audio', ensureLoggedIn(), upload.single('audio'), Audio.upload);

app.post('/raw_audio', ensureLoggedIn(), upload.single('audio'), (req, res) => {
    res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${req.file.key}`);
});

app.post('/image/large_icon', ensureLoggedIn(), uploadResize(512,512).single('image'), (req, res) => {
    let filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
});
app.post('/image/small_icon', ensureLoggedIn(), uploadResize(108,108).single('image'), (req, res) => {
    let filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
});
app.post('/image/module_icon', ensureLoggedIn(), uploadResize(40,40).single('image'), (req, res) => {
    let filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
});
app.post('/image/card_icon', ensureLoggedIn(), uploadResize(108,108).single('image'), (req, res) => {
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
