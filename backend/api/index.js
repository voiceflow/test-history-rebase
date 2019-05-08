'use strict';

const express = require('express');
const path = require('path');

const { underMaintenance } = require('../../app/src/MAINTENANCE.js');

module.exports = (middleware, controllers) => {
  const router = express.Router();

  router.use(express.static(path.join(__dirname, '../../', 'app', 'build')));

  router.all((req, res, next) => {
    if (underMaintenance()) {
      return res.redirect('https://getvoiceflow.com/maintenance');
    }
    return controllers.verify(req.cookies.auth, (data) => {
      if (data) {
        req.user = data.user;
        req.secret = data.secret;
        req.userHash = data.userHash;
      }
      next();
    });
  });

  router.post('/elasticsearch/*', async (req, res) => {
    req.body = req.body.substring(24, req.body.length + 1);
    req.body = JSON.parse(req.body);
    const ESparams = req.params[0].split('/');
    const ESoptions = {
      index: ESparams[0],
      type: ESparams[1],
      body: req.body,
    };
    await controllers.ESclient.search(ESoptions)
      .then((data) => {
        res.send({ responses: [data] });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.get('/session/amazon/access_token', middleware.ensureLoggedIn(), controllers.Authentication.getAccessToken);
  router.get('/session/amazon/:code', middleware.ensureLoggedIn(), controllers.Authentication.getAmazonCode);
  router.delete('/session/amazon', middleware.ensureLoggedIn(), controllers.Authentication.deleteAmazon);

  router.get('/session/google/access_token', middleware.ensureLoggedIn(), controllers.Authentication.hasGoogleAccessToken);
  router.delete('/session/google/access_token', middleware.ensureLoggedIn(), controllers.Authentication.deleteGoogleAccessToken);
  router.get('/session/google/dialogflow_access_token/:project_id', middleware.ensureLoggedIn(), controllers.Authentication.hasDialogflowToken);
  router.post('/session/google/verify_token', middleware.ensureLoggedIn(), controllers.Authentication.verifyGoogleAccessToken);
  router.post('/session/google/verify_dialogflow_token', middleware.ensureLoggedIn(), controllers.Authentication.verifyDialogflowToken);
  router.delete('/session/google/dialogflow_access_token', middleware.ensureLoggedIn(), controllers.Authentication.deleteDialogflowToken);

  router.get('/session', controllers.Authentication.getSession);
  router.get('/session/vendor', middleware.ensureLoggedIn(), controllers.Authentication.getVendor);
  router.put('/session', controllers.Authentication.putSession);
  router.delete('/session', controllers.Authentication.deleteSession);
  router.put('/googleLogin', controllers.Authentication.googleLogin);
  router.put('/fbLogin', controllers.Authentication.fbLogin);
  router.get('/user', middleware.ensureLoggedIn(), controllers.Authentication.getUser);
  router.put('/user', controllers.Authentication.putUser);
  router.post('/user/reset', controllers.Authentication.resetPasswordEmail);
  router.get('/user/reset/:token', controllers.Authentication.checkReset);
  router.post('/user/reset/:token', controllers.Authentication.resetPassword);
  router.get('/user/verify/:token', controllers.Authentication.verifyUser);
  router.post('/user/reset/password', controllers.Authentication.resetPassword);
  router.get('/decode/:id', middleware.ensureAdmin(), controllers.Decode.decodeId);
  router.get('/encode/:id', middleware.ensureAdmin(), controllers.Decode.encodeId);
  router.post('/user/profile/picture', middleware.ensureLoggedIn(), controllers.uploadResize(512, 512).single('image'), controllers.Authentication.updateProfilePicture);

  router.get('/creator/privacy_policy', controllers.policy);
  router.get('/creator/terms', controllers.terms);

  router.post('/test/api', middleware.ensureLoggedIn(), controllers.Test.api);

  router.get('/link_account/template/:skill_id', middleware.ensureLoggedIn(), controllers.LinkAccount.getTemplate);
  router.post('/link_account/template/:skill_id', middleware.ensureLoggedIn(), controllers.LinkAccount.setTemplate);

  router.get('/email/templates', middleware.ensureLoggedIn(), controllers.Email.getTemplates);
  router.get('/email/template/:id', middleware.ensureLoggedIn(), controllers.Email.getTemplate);
  router.post('/email/template', middleware.ensureLoggedIn(), controllers.Email.setTemplate);
  router.patch('/email/template/:id', middleware.ensureLoggedIn(), controllers.Email.setTemplate);
  router.delete('/email/template/:id', middleware.ensureLoggedIn(), controllers.Email.deleteTemplate);

  router.get('/multimodal/displays', middleware.ensureLoggedIn(), controllers.Multimodal.getDisplays);
  router.get('/multimodal/display/:id', middleware.ensureLoggedIn(), controllers.Multimodal.getDisplay);
  router.post('/multimodal/display', middleware.ensureLoggedIn(), controllers.Multimodal.setDisplay);
  router.patch('/multimodal/display/:id', middleware.ensureLoggedIn(), controllers.Multimodal.setDisplay);
  router.delete('/multimodal/display/:id', middleware.ensureLoggedIn(), controllers.Multimodal.deleteDisplay);
  router.post('/multimodal/display/render/:id', middleware.ensureLoggedIn(), controllers.Multimodal.renderDisplay);

  router.get('/project/:project_id/version/:version_id', middleware.ensureLoggedIn(), controllers.Skill.getSkill);
  router.delete('/projects/:project_id', middleware.ensureLoggedIn(), controllers.Team.verifyProjectAccess, controllers.Project.deleteProject);
  router.get('/project/:project_id/live_version', middleware.ensureLoggedIn(), controllers.Project.getLiveVersion);
  router.get('/project/:project_id/dev_version', middleware.ensureLoggedIn(), controllers.Project.getDevVersion);
  router.get('/project/:project_id/versions', middleware.ensureLoggedIn(), controllers.Project.getProjectVersions);
  router.post('/project/:project_id/render', middleware.ensureLoggedIn(), controllers.Project.render);
  router.post('/project/:project_id/version/:version_id/alexa', middleware.ensureLoggedIn(), controllers.Skill.buildSkill);
  router.post('/project/:project_id/version/:version_id/google', middleware.ensureLoggedIn(), controllers.Skill.buildGoogleSkill);
  router.get('/user/:creator_id/projects', middleware.ensureAdmin(), controllers.Project.getUserProjects);
  router.patch('/project/:project_id/amzn_id', middleware.ensureLoggedIn(), controllers.Team.verifyProjectAccess, controllers.Project.updateSkillId);

  router.post('/version/:version_id/copy/team/:team_id', middleware.ensureLoggedIn(), controllers.Team.verifyTeam,
    (req, res) => controllers.copySkill(req, res, {
      append_copy_str: true,
      user_copy: true,
    }));

  // VERSION STUFF
  router.get('/skill/:skill_id', middleware.ensureLoggedIn(), controllers.Project.getProjectFromSkill, controllers.Skill.getSkill);
  router.get('/skill/google/:id', middleware.ensureLoggedIn(), controllers.Skill.getGoogleSkill);
  router.get('/skill/:id/diagrams', middleware.ensureLoggedIn(), controllers.Skill.getDiagrams);
  router.post('/skill/:restore_id/restore', middleware.ensureLoggedIn(), controllers.Skill.restoreSkillVersion);
  router.get('/interaction_model/:amzn_id/status', middleware.ensureLoggedIn(), controllers.Skill.checkInterationModel);
  router.put('/interaction_model/:amzn_id/enable', middleware.ensureLoggedIn(), controllers.Skill.enableSkill);
  router.post('/skill/:id/:pid/:target_creator/copy', middleware.ensureLoggedIn(), controllers.Skill.copyProduct);
  router.post('/skill/product', middleware.ensureLoggedIn(), controllers.Skill.setProduct);
  router.get('/skill/:id/products', middleware.ensureLoggedIn(), controllers.Skill.getProducts);
  router.get('/skill/:id/product/:pid', middleware.ensureLoggedIn(), controllers.Skill.getProduct);
  router.post('/amazon/:id/:amzn_id/certify', middleware.ensureLoggedIn(), controllers.Skill.certifySkill);
  router.post('/amazon/:amzn_id/withdraw', middleware.ensureLoggedIn(), controllers.Skill.withdrawSkill);
  router.patch('/skill/:id', middleware.ensureLoggedIn(), controllers.Skill.patchSkill);
  router.delete('/skill/:id/product/:pid', middleware.ensureLoggedIn(), controllers.Skill.deleteProduct);
  router.get('/version/:version_id/info', middleware.ensureAdmin(), controllers.Skill.getVersionInfo);

  // TEAM RESTful CRUD STUFF
  router.post('/team', middleware.ensureLoggedIn(), controllers.Team.addTeam);
  router.post('/team/checkout', middleware.ensureLoggedIn(), controllers.Team.checkout);
  router.get('/teams', middleware.ensureLoggedIn(), controllers.Team.getTeams);
  router.get('/teams/:creator_id', middleware.ensureAdmin(), controllers.Team.getTeams);
  router.get('/team/:team_id/invoice', middleware.ensureLoggedIn(), controllers.Team.getInvoice);
  router.get('/team/:team_id/source', middleware.ensureLoggedIn(), controllers.Team.getSource);
  router.patch('/team/:team_id/source', middleware.ensureLoggedIn(), controllers.Team.updateSource);
  router.post('/team/invite/:invite_code', middleware.ensureLoggedIn(), controllers.Team.checkInvite);
  router.get('/team/:team_id/boards', middleware.ensureLoggedIn(), controllers.Team.getBoards);
  router.patch('/team/:team_id/update_board', middleware.ensureLoggedIn(), controllers.Team.updateBoard);
  router.get('/team/:team_id/projects', middleware.ensureLoggedIn(), controllers.Team.getProjects);
  router.get('/team/:team_id/members', middleware.ensureLoggedIn(), controllers.Team.getMembers);
  router.patch('/team/:team_id/members', middleware.ensureLoggedIn(), controllers.Team.updateMembers);
  router.post('/team/:team_id/copy/module/:module_id', middleware.ensureLoggedIn(), controllers.Team.verifyTeam, controllers.Marketplace.copyDefaultTemplate);
  router.delete('/team/:team_id/member/:creator_id', controllers.Team.deleteMember);
  router.delete('/team/:team_id', controllers.Team.deleteTeam);
  router.post('/team/:team_id/picture', middleware.ensureLoggedIn(), controllers.Team.verifyTeam, controllers.uploadResize(512, 512).single('image'), controllers.Team.updatePicture);

  // STRIPE PAYMENT ENDPOINTS
  router.post('/customer/webhook', controllers.Team.webhook);

  router.get('/diagram/:id', middleware.ensureLoggedIn(), controllers.Diagram.getDiagram);
  router.get('/diagram/:id/variables', middleware.ensureLoggedIn(), controllers.Diagram.getVariables);
  router.post('/diagram/:diagram_id/:skill_id/rerender', middleware.ensureLoggedIn(), controllers.Diagram.rerenderDiagram);
  router.delete('/diagram/:id', middleware.ensureLoggedIn(), controllers.Diagram.deleteDiagram);
  router.post('/diagram', middleware.ensureLoggedIn(), controllers.Diagram.setDiagram);
  router.post('/diagram/:id/name', middleware.ensureLoggedIn(), controllers.Diagram.updateName);
  router.post('/diagram/:diagram_id/test/publish', middleware.ensureLoggedIn(), controllers.Diagram.publishTest);
  router.get('/diagram/copy/:diagram_id', middleware.ensureLoggedIn(), controllers.Diagram.copyDiagram);

  /*
      COMMENT OUT ACTUAL MARKETPLACE ROUTES FOR MASTER
  */
  // router.get('/marketplace/default_templates', middleware.ensureLoggedIn(), controllers.Marketplace.getDefaultTemplates)
  // router.post('/marketplace/template/:module_id/copy', middleware.ensureLoggedIn(), controllers.Marketplace.copyDefaultTemplate)
  // router.get('/marketplace/featured', middleware.ensureLoggedIn(), controllers.Marketplace.getFeaturedModules)
  // router.get('/marketplace/user_module/:project_id', middleware.ensureLoggedIn(), controllers.Marketplace.getUserModules)
  // router.get('/marketplace/cert/pending', middleware.ensureAdmin(), controllers.Marketplace.getPendingModules)
  // router.get('/marketplace/cert/status/:project_id', middleware.ensureLoggedIn(), controllers.Marketplace.certStatus)
  // router.get('/marketplace/cert/:project_id', middleware.ensureLoggedIn(), controllers.Marketplace.getCertModule)
  // router.post('/marketplace/cert/:skill_id/:project_id', middleware.ensureLoggedIn(), controllers.Marketplace.requestCertification)
  // router.put('/marketplace/cert/:project_id', middleware.ensureAdmin(), controllers.Marketplace.giveCertification)
  // // It doesn't appear that this route needs the version_id param
  // router.delete('/marketplace/cert/:skill_id/:project_id', middleware.ensureLoggedIn(), controllers.Marketplace.cancelCertification)
  // router.patch('/marketplace/cert/:project_id', middleware.ensureLoggedIn(), controllers.Marketplace.saveCertification)
  // router.post('/marketplace/user_module/:project_id/:module_id', middleware.ensureLoggedIn(), controllers.Marketplace.giveAccess)
  // router.get('/marketplace/user_module/:project_id/:module_id', middleware.ensureLoggedIn(), controllers.Marketplace.checkConflicts)
  // router.delete('/marketplace/user_module/:project_id/:module_id', middleware.ensureLoggedIn(), controllers.Marketplace.removeAccess)
  // router.get('/marketplace/template/:module_id', middleware.ensureLoggedIn(), controllers.Marketplace.retrieveTemplate)
  // router.get('/marketplace/default_templates', middleware.ensureLoggedIn(), controllers.Marketplace.getDefaultTemplates)
  // router.get('/marketplace/initial_template', middleware.ensureLoggedIn(), controllers.Marketplace.getInitialTemplate)
  // router.get('/marketplace/:project_id', middleware.ensureLoggedIn(), controllers.Marketplace.getModules)
  // router.get('/marketplace/:module_id', middleware.ensureLoggedIn(), controllers.Marketplace.getModule)
  // router.get('/marketplace/diagram/:module_id', middleware.ensureLoggedIn(), controllers.Marketplace.getModuleDiagram)

  router.get('/marketplace/default_templates', middleware.ensureLoggedIn(), controllers.Marketplace.getDefaultTemplates);
  router.post('/marketplace/template/:module_id/copy', middleware.ensureLoggedIn(), controllers.Marketplace.copyDefaultTemplate);
  router.get('/marketplace/featured', middleware.ensureBeta(), controllers.Marketplace.getFeaturedModules);
  router.get('/marketplace/cert/pending', middleware.ensureAdmin(), controllers.Marketplace.getPendingModules);
  router.post('/marketplace/user_module/:project_id/:module_id', middleware.ensureBeta(), controllers.Marketplace.giveAccess);
  router.get('/marketplace/user_module/:project_id/:module_id', middleware.ensureBeta(), controllers.Marketplace.checkConflicts);
  router.delete('/marketplace/user_module/:project_id/:module_id', middleware.ensureBeta(), controllers.Marketplace.removeAccess);
  router.get('/marketplace/user_module/:project_id', middleware.ensureLoggedIn(), controllers.Marketplace.getUserModules);
  router.get('/marketplace/cert/status/:project_id', middleware.ensureBeta(), controllers.Marketplace.certStatus);
  router.post('/marketplace/cert/:skill_id/:project_id', middleware.ensureBeta(), controllers.Marketplace.requestCertification);
  router.delete('/marketplace/cert/:skill_id/:project_id', middleware.ensureBeta(), controllers.Marketplace.cancelCertification);
  router.get('/marketplace/cert/:project_id', middleware.ensureBeta(), controllers.Marketplace.getCertModule);
  router.put('/marketplace/cert/:project_id', middleware.ensureAdmin(), controllers.Marketplace.giveCertification);
  router.patch('/marketplace/cert/:project_id', middleware.ensureBeta(), controllers.Marketplace.saveCertification);
  router.get('/marketplace/template/:module_id', middleware.ensureLoggedIn(), controllers.Marketplace.retrieveTemplate);
  router.get('/marketplace/default_templates', middleware.ensureLoggedIn(), controllers.Marketplace.getDefaultTemplates);
  router.get('/marketplace/initial_template', middleware.ensureLoggedIn(), controllers.Marketplace.getInitialTemplate);
  router.get('/marketplace/:project_id', middleware.ensureBeta(), controllers.Marketplace.getModules);
  router.get('/marketplace/:module_id', middleware.ensureBeta(), controllers.Marketplace.getModule);
  router.get('/marketplace/diagram/:module_id', middleware.ensureBeta(), controllers.Marketplace.getModuleDiagram);

  router.post('/analytics/track_onboarding', middleware.ensureLoggedIn(), controllers.Track.trackOnboarding);
  router.post('/analytics/track_session_time', middleware.ensureLoggedIn(), controllers.Track.trackSessionTime);
  router.post('/analytics/track_active_canvas', middleware.ensureLoggedIn(), controllers.Track.trackCanvasTime);
  router.post('/analytics/track_first_session_upload', middleware.ensureLoggedIn(), controllers.Track.trackFirstSessionUpload);
  router.post('/analytics/track_first_project', middleware.ensureLoggedIn(), controllers.Track.trackFirstProject);
  router.post('/analytics/track_dev_account', middleware.ensureLoggedIn(), controllers.Track.trackDevAccount);
  router.post('/analytics/track_flow_used', middleware.ensureLoggedIn(), controllers.Track.trackFlowUsed);

  router.post('/integrations/get_users', middleware.ensureLoggedIn(), controllers.Integrations.getAllUsers);
  router.post('/integrations/add_user', middleware.ensureLoggedIn(), controllers.Integrations.addUser);
  router.post('/integrations/delete_user', middleware.ensureLoggedIn(), controllers.Integrations.deleteUser);

  router.post('/integrations/google_sheets/spreadsheets', middleware.ensureLoggedIn(), controllers.GoogleSheets.getSpreadsheets);
  router.post('/integrations/google_sheets/spreadsheet_sheets', middleware.ensureLoggedIn(), controllers.GoogleSheets.getSpreadsheetSheets);
  router.post('/integrations/google_sheets/sheet_headers', middleware.ensureLoggedIn(), controllers.GoogleSheets.getSheetHeaders);

  router.post('/integrations/google_sheets/retrieve_data', middleware.ensureLoggedIn(), controllers.GoogleSheets.retrieveData);
  router.post('/integrations/google_sheets/create_data', middleware.ensureLoggedIn(), controllers.GoogleSheets.createData);
  router.post('/integrations/google_sheets/update_data', middleware.ensureLoggedIn(), controllers.GoogleSheets.updateData);
  router.post('/integrations/google_sheets/delete_data', middleware.ensureLoggedIn(), controllers.GoogleSheets.deleteData);

  router.post('/integrations/custom/make_test_api_call', middleware.ensureLoggedIn(), controllers.Custom.makeTestAPICall);

  router.post('/analytics/track_dev_account', middleware.ensureLoggedIn(), controllers.Track.trackDevAccount);

  router.get('/analytics/:project_id/users', middleware.ensureLoggedIn(), controllers.Analytics.getUsersData);
  router.get('/analytics/:project_id/:from/:to/:user_tz/DAU', middleware.ensureLoggedIn(), controllers.Analytics.getDAU);
  router.get('/analytics/:project_id', middleware.ensureLoggedIn(), controllers.Analytics.getStats);

  router.get('/onboard', middleware.ensureLoggedIn(), controllers.Onboard.checkIfOnboarded);
  router.post('/onboard', middleware.ensureLoggedIn(), controllers.Onboard.submitOnboardSurvey);

  router.get('/product_updates', middleware.ensureLoggedIn(), controllers.ProductUpdates.getUpdates);
  router.post('/product_updates', middleware.ensureLoggedIn(), controllers.ProductUpdates.createUpdate);

  router.get('/logs/:skill_id', middleware.ensureLoggedIn(), controllers.Logs.getLogsUser);

  router.get('/admin', middleware.ensureAdmin());
  router.get('/admin/*', middleware.ensureAdmin());

  router.get('/codes/:num', middleware.ensureAdmin(), controllers.Code.endpoint);

  router.get('/errors/:env', middleware.ensureLoggedIn(), controllers.Problem.getErrors);
  router.post('/errors', controllers.Problem.sendError);

  router.get('/voices', middleware.ensureLoggedIn(), controllers.Audio.getVoices);
  // router.post('/generate', middleware.ensureLoggedIn(), controllers.Audio.generate);
  router.post('/audio', middleware.ensureLoggedIn(), controllers.upload.single('audio'), controllers.Audio.upload);

  router.post('/raw_audio', middleware.ensureLoggedIn(), controllers.upload.single('audio'), (req, res) => {
    res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${req.file.key}`);
  });

  router.post('/image/large_icon', middleware.ensureLoggedIn(), controllers.uploadResize(512, 512).single('image'), (req, res) => {
    const filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
  });
  router.post('/image/small_icon', middleware.ensureLoggedIn(), controllers.uploadResize(108, 108).single('image'), (req, res) => {
    const filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
  });
  router.post('/image/module_icon', middleware.ensureLoggedIn(), controllers.uploadResize(40, 40).single('image'), (req, res) => {
    const filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
  });
  router.post('/image/card_icon', middleware.ensureLoggedIn(), controllers.uploadResize(108, 108).single('image'), (req, res) => {
    const filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
  });

  router.post('/image', middleware.ensureLoggedIn(), controllers.upload.any(), (req, res) => {
    res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${req.files[0].key}`);
  });

  router.post('/concat', middleware.ensureLoggedIn(), controllers.Audio.concat);

  // Handle React routing, return all requests to React app
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'build', 'index.html'));
  });

  return router;
};
