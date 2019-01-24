require('dotenv').config()
if (process.env.NODE_ENV) {
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV !== 'test') console.debug(`Running in ${process.env.NODE_ENV} environment`)
} else {
    process.env.NODE_ENV = 'test'
    // eslint-disable-next-line no-console
    console.debug(`No Environment Set! Running in ${process.env.NODE_ENV} environment by default`)
}

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {upload, uploadResize, redisClient, jwt, config, verify} = require('./services');
const { getEnvVariable } = require('./util')
const policy = require('./policy');
const AWS = require('aws-sdk')

AWS.config = new AWS.Config({
    accessKeyId: getEnvVariable('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVariable('AWS_SECRET_ACCESS_KEY'),
    region: getEnvVariable('AWS_REGION'),
    endpoint: getEnvVariable('AWS_ENDPOINT')
});

// IMPORT ROUTES
const Diagram = require('./routes/diagram.js');
const Customer = require('./routes/customer.js');
const Skill = require('./routes/skill.js');
const Problem = require('./routes/error.js');
const LinkAccount = require('./routes/linkaccount.js')
const Audio = require('./routes/audio.js');
const Test = require('./routes/test.js');
const Authentication = require('./routes/authentication');
const Code = require('./config/codes.js');
const Decode = require('./routes/decode.js');
const Marketplace = require('./routes/marketplace.js');
const Email = require('./routes/email.js');
const Multimodal = require('./routes/multimodal/multimodal')
const Onboard = require('./routes/onboard.js');
const Logs = require('./routes/logs.js')
const Analytics = require('./routes/analytics.js')
const Mail = require('./routes/mail.js');
const {copySkill} = require('./routes/skill_util')
const Track = require('./routes/track.js')

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
    verify(req.cookies.auth, data => {
        if(data){
            req.user = data.user
            req.secret = data.secret
            req.userHash = data.userHash
        }
        next()
    })
})

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
app.put('/googleLogin', Authentication.googleLogin);
app.put('/fbLogin', Authentication.fbLogin);
app.get('/user', ensureLoggedIn(), Authentication.getUser)
app.put('/user', Authentication.putUser);
app.post('/user/reset', Authentication.resetPasswordEmail);
app.get('/user/reset/:token', Authentication.checkReset);
app.post('/user/reset/:token', Authentication.resetPassword);
app.get('/user/verify/:token', Authentication.verifyUser);
app.post('/user/reset/password', Authentication.resetPassword);
app.get('/decode/:id', ensureAdmin(),Decode.decodeId);
app.get('/encode/:id', ensureAdmin(),Decode.encodeId);

app.get('/creator/privacy_policy', policy);
app.get('/business', ensurePlan(1));
app.get('/business/*', ensurePlan(1));

app.post('/test/api', ensureLoggedIn(), Test.api)

app.get('/link_account/template/:id', ensurePlan(1), LinkAccount.getTemplate);
app.post('/link_account/template', ensurePlan(1), LinkAccount.setTemplate);

app.post('/requestPDF', ensureLoggedIn(), Mail.sendRequestPDFEmail);

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
app.get('/skill/:id/versions', ensureLoggedIn(), Skill.getSkillVersions)
app.post('/skill/:restore_id/:canonical_skill_id/restore', ensurePlan(1), Skill.restoreSkillVersion)
app.get('/interaction_model/:amzn_id/status', ensureLoggedIn(), Skill.checkInterationModel)
app.put('/interaction_model/:amzn_id/enable', ensureLoggedIn(), Skill.enableSkill)
app.post('/skill/:id/:pid/:target_creator/copy', ensureLoggedIn(), Skill.copyProduct)
app.post('/skill/:id/:target_creator/copy', ensureLoggedIn(), (req, res) => copySkill(req, res, {append_copy_str: true, user_copy: true}))
app.post('/skill/product', ensureLoggedIn(), Skill.setProduct);
app.get('/skill/:id/products', ensureLoggedIn(), Skill.getProducts);
app.get('/skill/:sid/product/:pid', ensureLoggedIn(), Skill.getProduct);
// app.post('/skill', ensureLoggedIn(), Skill.setSkill);
app.post('/skill/:id/publish', ensureLoggedIn(), Skill.buildSkill);
app.post('/amazon/:id/:amzn_id/certify', ensureLoggedIn(), Skill.certifySkill);
app.post('/amazon/:amzn_id/withdraw', ensureLoggedIn(), Skill.withdrawSkill);
app.patch('/skill/:id', ensureLoggedIn(), Skill.patchSkill);
app.delete('/skill/:id/product/:pid', ensureLoggedIn(), Skill.deleteProduct);
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

/*
    COMMENT OUT ACTUAL MARKETPLACE ROUTES FOR MASTER
*/
// app.get('/marketplace', ensureLoggedIn(), Marketplace.getModules)
// app.post('/marketplace/template/:module_id/copy', ensureLoggedIn(), Marketplace.copyDefaultTemplate)
// app.get('/marketplace/featured', ensureLoggedIn(), Marketplace.getFeaturedModules)
// app.get('/marketplace/user_module', ensureLoggedIn(), Marketplace.getUserModules)
// app.get('/marketplace/cert/pending', ensureAdmin(), Marketplace.getPendingModules)
// app.get('/marketplace/cert/status/:skill_id', ensureLoggedIn(), Marketplace.certStatus)
// app.get('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.getCertModule)
// app.post('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.requestCertification)
// app.put('/marketplace/cert/:skill_id', ensureAdmin(), Marketplace.giveCertification)
// app.delete('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.cancelCertification)
// app.patch('/marketplace/cert/:skill_id', ensureLoggedIn(), Marketplace.saveCertification)
// app.post('/marketplace/user_module/:module_id', ensureLoggedIn(), Marketplace.giveAccess)
// app.get('/marketplace/user_module/:module_id', ensureLoggedIn(), Marketplace.hasAccess)
// app.delete('/marketplace/user_module/:module_id', ensureLoggedIn(), Marketplace.removeAccess)
// app.get('/marketplace/template/:module_id', ensureLoggedIn(), Marketplace.retrieveTemplate)
// app.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates)
// app.get('/marketplace/:module_id', ensureLoggedIn(), Marketplace.getModule)

app.get('/marketplace', ensureAdmin(), Marketplace.getModules)
app.post('/marketplace/template/:module_id/copy', ensureLoggedIn(), Marketplace.copyDefaultTemplate)
app.get('/marketplace/featured', ensureAdmin(), Marketplace.getFeaturedModules)
app.get('/marketplace/user_module', ensureAdmin(), Marketplace.getUserModules)
app.get('/marketplace/cert/pending', ensureAdmin(), Marketplace.getPendingModules)
app.get('/marketplace/cert/status/:skill_id', ensureAdmin(), Marketplace.certStatus)
app.get('/marketplace/cert/:skill_id', ensureAdmin(), Marketplace.getCertModule)
app.post('/marketplace/cert/:skill_id', ensureAdmin(), Marketplace.requestCertification)
app.put('/marketplace/cert/:skill_id', ensureAdmin(), Marketplace.giveCertification)
app.delete('/marketplace/cert/:skill_id', ensureAdmin(), Marketplace.cancelCertification)
app.patch('/marketplace/cert/:skill_id', ensureAdmin(), Marketplace.saveCertification)
app.post('/marketplace/user_module/:module_id', ensureAdmin(), Marketplace.giveAccess)
app.get('/marketplace/user_module/:module_id', ensureAdmin(), Marketplace.hasAccess)
app.delete('/marketplace/user_module/:module_id', ensureAdmin(), Marketplace.removeAccess)
app.get('/marketplace/template/:module_id', ensureAdmin(), Marketplace.retrieveTemplate)
app.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates)
app.get('/marketplace/:module_id', ensureAdmin(), Marketplace.getModule)

app.post('/analytics/track_onboarding', ensureLoggedIn(), Track.trackOnboarding)
app.post('/analytics/track_canvas_time', ensureLoggedIn(), Track.trackCanvasTime)

app.get('/analytics/:skill_id/users', ensureLoggedIn(), Analytics.getUsersData)
app.get('/analytics/:skill_id/:from/:to/DAU', ensureLoggedIn(), Analytics.getDAU)

app.get('/onboard', ensureLoggedIn(), Onboard.checkIfOnboarded);
app.post('/onboard', ensureLoggedIn(), Onboard.submitOnboardSurvey);

app.get('/logs/:skill_id', ensureLoggedIn(), Logs.getLogs)

app.get('/admin', ensureAdmin());
app.get('/admin/*', ensureAdmin());

app.get('/codes/:num', ensureAdmin(), Code.endpoint);

app.get('/errors/:env', ensureLoggedIn(), Problem.getErrors);

app.get('/voices', ensureLoggedIn(), Audio.getVoices)
// app.post('/generate', ensureLoggedIn(), Audio.generate);
app.post('/audio', ensureLoggedIn(), upload.single('audio'), Audio.upload)

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

module.exports = app;
