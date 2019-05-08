'use strict';

const express = require('express');

module.exports = (middleware, controllers) => {
  const router = express.Router();

  router.post('/elasticsearch/*', (req, res) => {
    req.body = req.body.substring(24, req.body.length + 1);
    req.body = JSON.parse(req.body);
    const ESparams = req.params[0].split('/');
    const ESoptions = {
      index: ESparams[0],
      type: ESparams[1],
      body: req.body,
    };
    ESclient.search(ESoptions)
      .then((data) => {
        res.send({ responses: [data] });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.get('/session/amazon/access_token', ensureLoggedIn(), Authentication.getAccessToken);
  router.get('/session/amazon/:code', ensureLoggedIn(), Authentication.getAmazonCode);
  router.delete('/session/amazon', ensureLoggedIn(), Authentication.deleteAmazon);

  router.get('/session/google/access_token', ensureLoggedIn(), Authentication.hasGoogleAccessToken);
  router.delete('/session/google/access_token', ensureLoggedIn(), Authentication.deleteGoogleAccessToken);
  router.get('/session/google/dialogflow_access_token/:project_id', ensureLoggedIn(), Authentication.hasDialogflowToken);
  router.post('/session/google/verify_token', ensureLoggedIn(), Authentication.verifyGoogleAccessToken);
  router.post('/session/google/verify_dialogflow_token', ensureLoggedIn(), Authentication.verifyDialogflowToken);
  router.delete('/session/google/dialogflow_access_token', ensureLoggedIn(), Authentication.deleteDialogflowToken);

  router.get('/session', Authentication.getSession);
  router.get('/session/vendor', ensureLoggedIn(), Authentication.getVendor);
  router.put('/session', Authentication.putSession);
  router.delete('/session', Authentication.deleteSession);
  router.put('/googleLogin', Authentication.googleLogin);
  router.put('/fbLogin', Authentication.fbLogin);
  router.get('/user', ensureLoggedIn(), Authentication.getUser);
  router.put('/user', Authentication.putUser);
  router.post('/user/reset', Authentication.resetPasswordEmail);
  router.get('/user/reset/:token', Authentication.checkReset);
  router.post('/user/reset/:token', Authentication.resetPassword);
  router.get('/user/verify/:token', Authentication.verifyUser);
  router.post('/user/reset/password', Authentication.resetPassword);
  router.get('/decode/:id', ensureAdmin(), Decode.decodeId);
  router.get('/encode/:id', ensureAdmin(), Decode.encodeId);
  router.post('/user/profile/picture', ensureLoggedIn(), uploadResize(512, 512).single('image'), Authentication.updateProfilePicture);

  router.get('/creator/privacy_policy', policy);
  router.get('/creator/terms', terms);

  router.post('/test/api', ensureLoggedIn(), Test.api);

  router.get('/link_account/template/:skill_id', ensureLoggedIn(), LinkAccount.getTemplate);
  router.post('/link_account/template/:skill_id', ensureLoggedIn(), LinkAccount.setTemplate);

  router.get('/email/templates', ensureLoggedIn(), Email.getTemplates);
  router.get('/email/template/:id', ensureLoggedIn(), Email.getTemplate);
  router.post('/email/template', ensureLoggedIn(), Email.setTemplate);
  router.patch('/email/template/:id', ensureLoggedIn(), Email.setTemplate);
  router.delete('/email/template/:id', ensureLoggedIn(), Email.deleteTemplate);

  router.get('/multimodal/displays', ensureLoggedIn(), Multimodal.getDisplays);
  router.get('/multimodal/display/:id', ensureLoggedIn(), Multimodal.getDisplay);
  router.post('/multimodal/display', ensureLoggedIn(), Multimodal.setDisplay);
  router.patch('/multimodal/display/:id', ensureLoggedIn(), Multimodal.setDisplay);
  router.delete('/multimodal/display/:id', ensureLoggedIn(), Multimodal.deleteDisplay);
  router.post('/multimodal/display/render/:id', ensureLoggedIn(), Multimodal.renderDisplay);

  router.get('/project/:project_id/version/:version_id', ensureLoggedIn(), Skill.getSkill);
  router.delete('/projects/:project_id', ensureLoggedIn(), Team.verifyProjectAccess, Project.deleteProject);
  router.get('/project/:project_id/live_version', ensureLoggedIn(), Project.getLiveVersion);
  router.get('/project/:project_id/dev_version', ensureLoggedIn(), Project.getDevVersion);
  router.get('/project/:project_id/versions', ensureLoggedIn(), Project.getProjectVersions);
  router.post('/project/:project_id/render', ensureLoggedIn(), Project.render);
  router.post('/project/:project_id/version/:version_id/alexa', ensureLoggedIn(), Skill.buildSkill);
  router.post('/project/:project_id/version/:version_id/google', ensureLoggedIn(), Skill.buildGoogleSkill);
  router.get('/user/:creator_id/projects', ensureAdmin(), Project.getUserProjects);
  router.patch('/project/:project_id/amzn_id', ensureLoggedIn(), Team.verifyProjectAccess, Project.updateSkillId);

  router.post('/version/:version_id/copy/team/:team_id', ensureLoggedIn(), Team.verifyTeam,
    (req, res) => copySkill(req, res, { append_copy_str: true, user_copy: true }));

// VERSION STUFF
  router.get('/skill/:skill_id', ensureLoggedIn(), Project.getProjectFromSkill, Skill.getSkill);
  router.get('/skill/google/:id', ensureLoggedIn(), Skill.getGoogleSkill);
  router.get('/skill/:id/diagrams', ensureLoggedIn(), Skill.getDiagrams);
  router.post('/skill/:restore_id/restore', ensureLoggedIn(), Skill.restoreSkillVersion);
  router.get('/interaction_model/:amzn_id/status', ensureLoggedIn(), Skill.checkInterationModel);
  router.put('/interaction_model/:amzn_id/enable', ensureLoggedIn(), Skill.enableSkill);
  router.post('/skill/:id/:pid/:target_creator/copy', ensureLoggedIn(), Skill.copyProduct);
  router.post('/skill/product', ensureLoggedIn(), Skill.setProduct);
  router.get('/skill/:id/products', ensureLoggedIn(), Skill.getProducts);
  router.get('/skill/:id/product/:pid', ensureLoggedIn(), Skill.getProduct);
  router.post('/amazon/:id/:amzn_id/certify', ensureLoggedIn(), Skill.certifySkill);
  router.post('/amazon/:amzn_id/withdraw', ensureLoggedIn(), Skill.withdrawSkill);
  router.patch('/skill/:id', ensureLoggedIn(), Skill.patchSkill);
  router.delete('/skill/:id/product/:pid', ensureLoggedIn(), Skill.deleteProduct);
  router.get('/version/:version_id/info', ensureAdmin(), Skill.getVersionInfo);

// TEAM RESTful CRUD STUFF
  router.post('/team', ensureLoggedIn(), Team.addTeam);
  router.post('/team/checkout', ensureLoggedIn(), Team.checkout);
  router.get('/teams', ensureLoggedIn(), Team.getTeams);
  router.get('/teams/:creator_id', ensureAdmin(), Team.getTeams);
  router.get('/team/:team_id/invoice', ensureLoggedIn(), Team.getInvoice);
  router.get('/team/:team_id/source', ensureLoggedIn(), Team.getSource);
  router.patch('/team/:team_id/source', ensureLoggedIn(), Team.updateSource);
  router.post('/team/invite/:invite_code', ensureLoggedIn(), Team.checkInvite);
  router.get('/team/:team_id/boards', ensureLoggedIn(), Team.getBoards);
  router.patch('/team/:team_id/update_board', ensureLoggedIn(), Team.updateBoard);
  router.get('/team/:team_id/projects', ensureLoggedIn(), Team.getProjects);
  router.get('/team/:team_id/members', ensureLoggedIn(), Team.getMembers);
  router.patch('/team/:team_id/members', ensureLoggedIn(), Team.updateMembers);
  router.post('/team/:team_id/copy/module/:module_id', ensureLoggedIn(), Team.verifyTeam, Marketplace.copyDefaultTemplate);
  router.delete('/team/:team_id/member/:creator_id', Team.deleteMember);
  router.delete('/team/:team_id', Team.deleteTeam);
  router.post('/team/:team_id/picture', ensureLoggedIn(), Team.verifyTeam, uploadResize(512, 512).single('image'), Team.updatePicture);

// STRIPE PAYMENT ENDPOINTS
  router.post('/customer/webhook', Team.webhook);

  router.get('/diagram/:id', ensureLoggedIn(), Diagram.getDiagram);
  router.get('/diagram/:id/variables', ensureLoggedIn(), Diagram.getVariables);
  router.post('/diagram/:diagram_id/:skill_id/rerender', ensureLoggedIn(), Diagram.rerenderDiagram);
  router.delete('/diagram/:id', ensureLoggedIn(), Diagram.deleteDiagram);
  router.post('/diagram', ensureLoggedIn(), Diagram.setDiagram);
  router.post('/diagram/:id/name', ensureLoggedIn(), Diagram.updateName);
  router.post('/diagram/:diagram_id/test/publish', ensureLoggedIn(), Diagram.publishTest);
  router.get('/diagram/copy/:diagram_id', ensureLoggedIn(), Diagram.copyDiagram);

  /*
      COMMENT OUT ACTUAL MARKETPLACE ROUTES FOR MASTER
  */
// router.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates)
// router.post('/marketplace/template/:module_id/copy', ensureLoggedIn(), Marketplace.copyDefaultTemplate)
// router.get('/marketplace/featured', ensureLoggedIn(), Marketplace.getFeaturedModules)
// router.get('/marketplace/user_module/:project_id', ensureLoggedIn(), Marketplace.getUserModules)
// router.get('/marketplace/cert/pending', ensureAdmin(), Marketplace.getPendingModules)
// router.get('/marketplace/cert/status/:project_id', ensureLoggedIn(), Marketplace.certStatus)
// router.get('/marketplace/cert/:project_id', ensureLoggedIn(), Marketplace.getCertModule)
// router.post('/marketplace/cert/:skill_id/:project_id', ensureLoggedIn(), Marketplace.requestCertification)
// router.put('/marketplace/cert/:project_id', ensureAdmin(), Marketplace.giveCertification)
// // It doesn't appear that this route needs the version_id param
// router.delete('/marketplace/cert/:skill_id/:project_id', ensureLoggedIn(), Marketplace.cancelCertification)
// router.patch('/marketplace/cert/:project_id', ensureLoggedIn(), Marketplace.saveCertification)
// router.post('/marketplace/user_module/:project_id/:module_id', ensureLoggedIn(), Marketplace.giveAccess)
// router.get('/marketplace/user_module/:project_id/:module_id', ensureLoggedIn(), Marketplace.checkConflicts)
// router.delete('/marketplace/user_module/:project_id/:module_id', ensureLoggedIn(), Marketplace.removeAccess)
// router.get('/marketplace/template/:module_id', ensureLoggedIn(), Marketplace.retrieveTemplate)
// router.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates)
// router.get('/marketplace/initial_template', ensureLoggedIn(), Marketplace.getInitialTemplate)
// router.get('/marketplace/:project_id', ensureLoggedIn(), Marketplace.getModules)
// router.get('/marketplace/:module_id', ensureLoggedIn(), Marketplace.getModule)
// router.get('/marketplace/diagram/:module_id', ensureLoggedIn(), Marketplace.getModuleDiagram)

  router.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates);
  router.post('/marketplace/template/:module_id/copy', ensureLoggedIn(), Marketplace.copyDefaultTemplate);
  router.get('/marketplace/featured', ensureBeta(), Marketplace.getFeaturedModules);
  router.get('/marketplace/cert/pending', ensureAdmin(), Marketplace.getPendingModules);
  router.post('/marketplace/user_module/:project_id/:module_id', ensureBeta(), Marketplace.giveAccess);
  router.get('/marketplace/user_module/:project_id/:module_id', ensureBeta(), Marketplace.checkConflicts);
  router.delete('/marketplace/user_module/:project_id/:module_id', ensureBeta(), Marketplace.removeAccess);
  router.get('/marketplace/user_module/:project_id', ensureLoggedIn(), Marketplace.getUserModules);
  router.get('/marketplace/cert/status/:project_id', ensureBeta(), Marketplace.certStatus);
  router.post('/marketplace/cert/:skill_id/:project_id', ensureBeta(), Marketplace.requestCertification);
  router.delete('/marketplace/cert/:skill_id/:project_id', ensureBeta(), Marketplace.cancelCertification);
  router.get('/marketplace/cert/:project_id', ensureBeta(), Marketplace.getCertModule);
  router.put('/marketplace/cert/:project_id', ensureAdmin(), Marketplace.giveCertification);
  router.patch('/marketplace/cert/:project_id', ensureBeta(), Marketplace.saveCertification);
  router.get('/marketplace/template/:module_id', ensureLoggedIn(), Marketplace.retrieveTemplate);
  router.get('/marketplace/default_templates', ensureLoggedIn(), Marketplace.getDefaultTemplates);
  router.get('/marketplace/initial_template', ensureLoggedIn(), Marketplace.getInitialTemplate);
  router.get('/marketplace/:project_id', ensureBeta(), Marketplace.getModules);
  router.get('/marketplace/:module_id', ensureBeta(), Marketplace.getModule);
  router.get('/marketplace/diagram/:module_id', ensureBeta(), Marketplace.getModuleDiagram);

  router.post('/analytics/track_onboarding', ensureLoggedIn(), Track.trackOnboarding);
  router.post('/analytics/track_session_time', ensureLoggedIn(), Track.trackSessionTime);
  router.post('/analytics/track_active_canvas', ensureLoggedIn(), Track.trackCanvasTime);
  router.post('/analytics/track_first_session_upload', ensureLoggedIn(), Track.trackFirstSessionUpload);
  router.post('/analytics/track_first_project', ensureLoggedIn(), Track.trackFirstProject);
  router.post('/analytics/track_dev_account', ensureLoggedIn(), Track.trackDevAccount);
  router.post('/analytics/track_flow_used', ensureLoggedIn(), Track.trackFlowUsed);

  router.post('/integrations/get_users', ensureLoggedIn(), Integrations.getAllUsers);
  router.post('/integrations/add_user', ensureLoggedIn(), Integrations.addUser);
  router.post('/integrations/delete_user', ensureLoggedIn(), Integrations.deleteUser);

  router.post('/integrations/google_sheets/spreadsheets', ensureLoggedIn(), GoogleSheets.getSpreadsheets);
  router.post('/integrations/google_sheets/spreadsheet_sheets', ensureLoggedIn(), GoogleSheets.getSpreadsheetSheets);
  router.post('/integrations/google_sheets/sheet_headers', ensureLoggedIn(), GoogleSheets.getSheetHeaders);

  router.post('/integrations/google_sheets/retrieve_data', ensureLoggedIn(), GoogleSheets.retrieveData);
  router.post('/integrations/google_sheets/create_data', ensureLoggedIn(), GoogleSheets.createData);
  router.post('/integrations/google_sheets/update_data', ensureLoggedIn(), GoogleSheets.updateData);
  router.post('/integrations/google_sheets/delete_data', ensureLoggedIn(), GoogleSheets.deleteData);

  router.post('/integrations/custom/make_test_api_call', ensureLoggedIn(), Custom.makeTestAPICall);

  router.post('/analytics/track_dev_account', ensureLoggedIn(), Track.trackDevAccount);

  router.get('/analytics/:project_id/users', ensureLoggedIn(), Analytics.getUsersData);
  router.get('/analytics/:project_id/:from/:to/:user_tz/DAU', ensureLoggedIn(), Analytics.getDAU);
  router.get('/analytics/:project_id', ensureLoggedIn(), Analytics.getStats);

  router.get('/onboard', ensureLoggedIn(), Onboard.checkIfOnboarded);
  router.post('/onboard', ensureLoggedIn(), Onboard.submitOnboardSurvey);

  router.get('/product_updates', ensureLoggedIn(), ProductUpdates.getUpdates);
  router.post('/product_updates', ensureLoggedIn(), ProductUpdates.createUpdate);

  router.get('/logs/:skill_id', ensureLoggedIn(), Logs.getLogsUser);

  router.get('/admin', ensureAdmin());
  router.get('/admin/*', ensureAdmin());

  router.get('/codes/:num', ensureAdmin(), Code.endpoint);

  router.get('/errors/:env', ensureLoggedIn(), Problem.getErrors);
  router.post('/errors', Problem.sendError);

  router.get('/voices', ensureLoggedIn(), Audio.getVoices);
// router.post('/generate', ensureLoggedIn(), Audio.generate);
  router.post('/audio', ensureLoggedIn(), upload.single('audio'), Audio.upload);

  router.post('/raw_audio', ensureLoggedIn(), upload.single('audio'), (req, res) => {
    res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${req.file.key}`);
  });

  router.post('/image/large_icon', ensureLoggedIn(), uploadResize(512, 512).single('image'), (req, res) => {
    const filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
  });
  router.post('/image/small_icon', ensureLoggedIn(), uploadResize(108, 108).single('image'), (req, res) => {
    const filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
  });
  router.post('/image/module_icon', ensureLoggedIn(), uploadResize(40, 40).single('image'), (req, res) => {
    const filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
  });
  router.post('/image/card_icon', ensureLoggedIn(), uploadResize(108, 108).single('image'), (req, res) => {
    const filename = req.file.transforms[0].key;
    res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${filename}`);
  });

  router.post('/image', ensureLoggedIn(), upload.any(), (req, res) => {
    res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${req.files[0].key}`);
  });

  router.post('/concat', ensureLoggedIn(), Audio.concat);

// Handle React routing, return all requests to React app
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'build', 'index.html'));
  });

  return router;
};
