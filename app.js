const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {upload, uploadResize, ESclient, verify} = require('./services');
const {policy, terms} = require('./policy');
const AWS = require('aws-sdk')
const { request_logger } = require('./logger.js')
const { underMaintenance } = require('./app/src/MAINTENANCE.js')

AWS.config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT
});

// IMPORT ROUTES
const Diagram = require('./routes/diagram.js');
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
const Team = require('./routes/team.js')
const Project = require('./routes/project.js');
const {copySkill} = require('./routes/skill_util')
const Track = require('./routes/track.js')
const ProductUpdates = require('./routes/product_updates.js')
const Integrations = require('./routes/integrations')
const GoogleSheets = require('./routes/integrations/googleSheets')
const Custom = require('./routes/integrations/custom')

app.use(cors())
app.use(helmet())
if(process.env.NODE_ENV !== 'test'){
    app.use(request_logger)
}

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

// Middleware for Authentication/Maintanence Check
app.use((req, res, next) => {
    if(underMaintenance()){
        return res.redirect('https://getvoiceflow.com/maintenance')
    }
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
// MARKETPLACE BETA
const ensureBeta = ()=> {
    return (req, res, next) => {
        if(req.user && req.user.admin === 7) next();
        else res.sendStatus(401);
    }
}

// Route for Elasticsearch
app.use(bodyParser.text({ type: 'application/x-ndjson' }))

app.post('/elasticsearch/*', (req, res) => {
    req.body = req.body.substring(24, req.body.length + 1)
    req.body = JSON.parse(req.body)
    let ESparams = req.params[0].split('/')
    ESoptions = {
        index: ESparams[0],
        type: ESparams[1],
        body: req.body,
    }
    ESclient.search(ESoptions)
    .then((data) => {
        res.send({responses: [data]})
    })
    .catch((err) => {
        console.log(err)
    })
})

app.get('/session/amazon/access_token', ensureLoggedIn(), Authentication.getAccessToken);
app.get('/session/amazon/:code', ensureLoggedIn(), Authentication.getAmazonCode);
app.delete('/session/amazon', ensureLoggedIn(), Authentication.deleteAmazon);

app.get('/session/google/access_token', ensureLoggedIn(), Authentication.hasGoogleAccessToken);
app.delete('/session/google/access_token', ensureLoggedIn(), Authentication.deleteGoogleAccessToken);
app.get('/session/google/dialogflow_access_token/:project_id', ensureLoggedIn(), Authentication.hasDialogflowToken);
app.post('/session/google/verify_token', ensureLoggedIn(), Authentication.verifyGoogleAccessToken);
app.post('/session/google/verify_dialogflow_token', ensureLoggedIn(), Authentication.verifyDialogflowToken);
app.delete('/session/google/dialogflow_access_token', ensureLoggedIn(), Authentication.deleteDialogflowToken);

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
app.post('/user/profile/picture', ensureLoggedIn(), uploadResize(512,512).single('image'), Authentication.updateProfilePicture);

app.get('/creator/privacy_policy', policy)
app.get('/creator/terms', terms)

app.post('/test/api', ensureLoggedIn(), Test.api)

app.get('/link_account/template/:skill_id', ensureLoggedIn(), LinkAccount.getTemplate);
app.post('/link_account/template/:skill_id', ensureLoggedIn(), LinkAccount.setTemplate);

app.get('/email/templates', ensureLoggedIn(), Email.getTemplates);
app.get('/email/template/:id', ensureLoggedIn(), Email.getTemplate);
app.post('/email/template', ensureLoggedIn(), Email.setTemplate);
app.patch('/email/template/:id', ensureLoggedIn(), Email.setTemplate);
app.delete('/email/template/:id', ensureLoggedIn(), Email.deleteTemplate);

app.get('/multimodal/displays', ensureLoggedIn(), Multimodal.getDisplays);
app.get('/multimodal/display/:id', ensureLoggedIn(), Multimodal.getDisplay);
app.post('/multimodal/display', ensureLoggedIn(), Multimodal.setDisplay);
app.patch('/multimodal/display/:id', ensureLoggedIn(), Multimodal.setDisplay);
app.delete('/multimodal/display/:id', ensureLoggedIn(), Multimodal.deleteDisplay);
app.post('/multimodal/display/render/:id', ensureLoggedIn(), Multimodal.renderDisplay);

app.get('/project/:project_id/version/:version_id', ensureLoggedIn(), Skill.getSkill)
app.delete('/projects/:project_id', ensureLoggedIn(), Team.verifyProjectAccess, Project.deleteProject)
app.get('/project/:project_id/live_version', ensureLoggedIn(), Project.getLiveVersion)
app.get('/project/:project_id/dev_version', ensureLoggedIn(), Project.getDevVersion)
app.get('/project/:project_id/versions', ensureLoggedIn(), Project.getProjectVersions)
app.post('/project/:project_id/render', ensureLoggedIn(), Project.render)
app.post('/project/:project_id/version/:version_id/alexa', ensureLoggedIn(), Skill.buildSkill);
app.post('/project/:project_id/version/:version_id/google', ensureLoggedIn(), Skill.buildGoogleSkill);
app.get('/user/:creator_id/projects', ensureAdmin(), Project.getUserProjects)
app.patch('/project/:project_id/amzn_id', ensureLoggedIn(), Team.verifyProjectAccess, Project.updateSkillId)

app.post('/version/:version_id/copy/team/:team_id', ensureLoggedIn(), Team.verifyTeam, 
(req, res) => copySkill(req, res, {append_copy_str: true, user_copy: true}))

// VERSION STUFF
app.get('/skill/:skill_id', ensureLoggedIn(), Project.getProjectFromSkill, Skill.getSkill);
app.get('/skill/google/:id', ensureLoggedIn(), Skill.getGoogleSkill);
app.get('/skill/:id/diagrams', ensureLoggedIn(), Skill.getDiagrams);
app.post('/skill/:restore_id/restore', ensurePlan(1), Skill.restoreSkillVersion)
app.get('/interaction_model/:amzn_id/status', ensureLoggedIn(), Skill.checkInterationModel)
app.put('/interaction_model/:amzn_id/enable', ensureLoggedIn(), Skill.enableSkill)
app.post('/skill/:id/:pid/:target_creator/copy', ensureLoggedIn(), Skill.copyProduct)
app.post('/skill/product', ensureLoggedIn(), Skill.setProduct);
app.get('/skill/:id/products', ensureLoggedIn(), Skill.getProducts);
app.get('/skill/:id/product/:pid', ensureLoggedIn(), Skill.getProduct);
app.post('/amazon/:id/:amzn_id/certify', ensureLoggedIn(), Skill.certifySkill);
app.post('/amazon/:amzn_id/withdraw', ensureLoggedIn(), Skill.withdrawSkill);
app.patch('/skill/:id', ensureLoggedIn(), Skill.patchSkill);
app.delete('/skill/:id/product/:pid', ensureLoggedIn(), Skill.deleteProduct);
app.get('/version/:version_id/info', ensureAdmin(), Skill.getVersionInfo)

// TEAM RESTful CRUD STUFF
app.post('/team', ensureLoggedIn(), Team.addTeam)
app.post('/team/checkout', ensureLoggedIn(), Team.checkout)
app.get('/teams', ensureLoggedIn(), Team.getTeams)
app.get('/teams/:creator_id', ensureAdmin(), Team.getTeams)
app.get('/team/:team_id/invoice', ensureLoggedIn(), Team.getInvoice)
app.get('/team/:team_id/source', ensureLoggedIn(), Team.getSource)
app.patch('/team/:team_id/source', ensureLoggedIn(), Team.updateSource)
app.post('/team/invite/:invite_code', ensureLoggedIn(), Team.checkInvite)
app.get('/team/:team_id/projects', ensureLoggedIn(), Team.getProjects)
app.get('/team/:team_id/members', ensureLoggedIn(), Team.getMembers)
app.patch('/team/:team_id/members', ensureLoggedIn(), Team.updateMembers)
app.post('/team/:team_id/copy/module/:module_id', ensureLoggedIn(), Team.verifyTeam, Marketplace.copyDefaultTemplate)
app.delete('/team/:team_id/member/:creator_id', Team.deleteMember)
app.delete('/team/:team_id', Team.deleteTeam)
app.post('/team/:team_id/picture', ensureLoggedIn(), Team.verifyTeam, uploadResize(512,512).single('image'), Team.updatePicture);

// STRIPE PAYMENT ENDPOINTS
app.post('/customer/webhook', Team.webhook)

app.get('/diagram/:id', ensureLoggedIn(), Diagram.getDiagram);
app.get('/diagram/:id/variables', ensureLoggedIn(), Diagram.getVariables);
app.post('/diagram/:diagram_id/:skill_id/rerender', ensureLoggedIn(), Diagram.rerenderDiagram)
app.delete('/diagram/:id', ensureLoggedIn(), Diagram.deleteDiagram);
app.post('/diagram', ensureLoggedIn(), Diagram.setDiagram);
app.post('/diagram/:id/name', ensureLoggedIn(), Diagram.updateName);
app.post('/diagram/:diagram_id/test/publish', ensureLoggedIn(), Diagram.publishTest);
app.get('/diagram/copy/:diagram_id', ensureLoggedIn(), Diagram.copyDiagram)

/*
    COMMENT OUT ACTUAL MARKETPLACE ROUTES FOR MASTER
*/
// app.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates)
// app.post('/marketplace/template/:module_id/copy', ensureLoggedIn(), Marketplace.copyDefaultTemplate)
// app.get('/marketplace/featured', ensureLoggedIn(), Marketplace.getFeaturedModules)
// app.get('/marketplace/user_module/:project_id', ensureLoggedIn(), Marketplace.getUserModules)
// app.get('/marketplace/cert/pending', ensureAdmin(), Marketplace.getPendingModules)
// app.get('/marketplace/cert/status/:project_id', ensureLoggedIn(), Marketplace.certStatus)
// app.get('/marketplace/cert/:project_id', ensureLoggedIn(), Marketplace.getCertModule)
// app.post('/marketplace/cert/:skill_id/:project_id', ensureLoggedIn(), Marketplace.requestCertification)
// app.put('/marketplace/cert/:project_id', ensureAdmin(), Marketplace.giveCertification)
// // It doesn't appear that this route needs the version_id param
// app.delete('/marketplace/cert/:skill_id/:project_id', ensureLoggedIn(), Marketplace.cancelCertification)
// app.patch('/marketplace/cert/:project_id', ensureLoggedIn(), Marketplace.saveCertification)
// app.post('/marketplace/user_module/:project_id/:module_id', ensureLoggedIn(), Marketplace.giveAccess)
// app.get('/marketplace/user_module/:project_id/:module_id', ensureLoggedIn(), Marketplace.checkConflicts)
// app.delete('/marketplace/user_module/:project_id/:module_id', ensureLoggedIn(), Marketplace.removeAccess)
// app.get('/marketplace/template/:module_id', ensureLoggedIn(), Marketplace.retrieveTemplate)
// app.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates)
// app.get('/marketplace/initial_template', ensureLoggedIn(), Marketplace.getInitialTemplate)
// app.get('/marketplace/:project_id', ensureLoggedIn(), Marketplace.getModules)
// app.get('/marketplace/:module_id', ensureLoggedIn(), Marketplace.getModule)
// app.get('/marketplace/diagram/:module_id', ensureLoggedIn(), Marketplace.getModuleDiagram)

app.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates)
app.post('/marketplace/template/:module_id/copy', ensureLoggedIn(), Marketplace.copyDefaultTemplate)
app.get('/marketplace/featured', ensureBeta(), Marketplace.getFeaturedModules)
app.get('/marketplace/user_module/:project_id', ensureLoggedIn(), Marketplace.getUserModules)
app.get('/marketplace/cert/pending', ensureAdmin(), Marketplace.getPendingModules)
app.get('/marketplace/cert/status/:project_id', ensureBeta(), Marketplace.certStatus)
app.get('/marketplace/cert/:project_id', ensureBeta(), Marketplace.getCertModule)
app.post('/marketplace/cert/:skill_id/:project_id', ensureBeta(), Marketplace.requestCertification)
app.put('/marketplace/cert/:project_id', ensureAdmin(), Marketplace.giveCertification)
app.delete('/marketplace/cert/:skill_id/:project_id', ensureBeta(), Marketplace.cancelCertification)
app.patch('/marketplace/cert/:project_id', ensureBeta(), Marketplace.saveCertification)
app.post('/marketplace/user_module/:project_id/:module_id', ensureBeta(), Marketplace.giveAccess)
app.get('/marketplace/user_module/:project_id/:module_id', ensureBeta(), Marketplace.checkConflicts)
app.delete('/marketplace/user_module/:project_id/:module_id', ensureBeta(), Marketplace.removeAccess)
app.get('/marketplace/template/:module_id', ensureLoggedIn(), Marketplace.retrieveTemplate)
app.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates)
app.get('/marketplace/initial_template', ensureLoggedIn(), Marketplace.getInitialTemplate)
app.get('/marketplace/:project_id', ensureBeta(), Marketplace.getModules)
app.get('/marketplace/:module_id', ensureBeta(), Marketplace.getModule)
app.get('/marketplace/diagram/:module_id', ensureBeta(), Marketplace.getModuleDiagram)

app.post('/analytics/track_onboarding', ensureLoggedIn(), Track.trackOnboarding)
app.post('/analytics/track_session_time', ensureLoggedIn(), Track.trackSessionTime)
app.post('/analytics/track_active_canvas', ensureLoggedIn(), Track.trackCanvasTime)
app.post('/analytics/track_first_session_upload', ensureLoggedIn(), Track.trackFirstSessionUpload)
app.post('/analytics/track_first_project', ensureLoggedIn(), Track.trackFirstProject)
app.post('/analytics/track_dev_account', ensureLoggedIn(), Track.trackDevAccount)
app.post('/analytics/track_flow_used', ensureLoggedIn(), Track.trackFlowUsed)

app.post('/integrations/get_users', ensureLoggedIn(), Integrations.getAllUsers)
app.post('/integrations/add_user', ensureLoggedIn(), Integrations.addUser)
app.post('/integrations/delete_user', ensureLoggedIn(), Integrations.deleteUser)

app.post('/integrations/google_sheets/spreadsheets', ensureLoggedIn(), GoogleSheets.getSpreadsheets)
app.post('/integrations/google_sheets/spreadsheet_sheets', ensureLoggedIn(), GoogleSheets.getSpreadsheetSheets)
app.post('/integrations/google_sheets/sheet_headers', ensureLoggedIn(), GoogleSheets.getSheetHeaders)

app.post('/integrations/google_sheets/retrieve_data', ensureLoggedIn(), GoogleSheets.retrieveData)
app.post('/integrations/google_sheets/create_data', ensureLoggedIn(), GoogleSheets.createData)
app.post('/integrations/google_sheets/update_data', ensureLoggedIn(), GoogleSheets.updateData)
app.post('/integrations/google_sheets/delete_data', ensureLoggedIn(), GoogleSheets.deleteData)

app.post('/integrations/custom/make_test_api_call', ensureLoggedIn(), Custom.makeTestAPICall)

app.post('/analytics/track_dev_account', ensureLoggedIn(), Track.trackDevAccount)

app.get('/analytics/:project_id/users', ensureLoggedIn(), Analytics.getUsersData)
app.get('/analytics/:project_id/:from/:to/:user_tz/DAU', ensureLoggedIn(), Analytics.getDAU)
app.get('/analytics/:project_id', ensureLoggedIn(), Analytics.getStats)

app.get('/onboard', ensureLoggedIn(), Onboard.checkIfOnboarded);
app.post('/onboard', ensureLoggedIn(), Onboard.submitOnboardSurvey);

app.get('/product_updates/:ts', ensureLoggedIn(), ProductUpdates.getUpdates)
app.post('/product_updates', ensureLoggedIn(), ProductUpdates.createUpdate)

app.get('/logs/:skill_id', ensureLoggedIn(), Logs.getLogsUser)

app.get('/admin', ensureAdmin());
app.get('/admin/*', ensureAdmin());

app.get('/codes/:num', ensureAdmin(), Code.endpoint);

app.get('/errors/:env', ensureLoggedIn(), Problem.getErrors);
app.post('/errors', Problem.sendError);

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
