'use strict';

/* eslint-disable class-methods-use-this, no-empty-function */

const AWS = require('aws-sdk');
const path = require('path');
const Promise = require('bluebird');

const { ResponseBuilder } = require('@voiceflow/common').middleware;

const { upload, uploadResize, ESclient, verify } = require('../services');
const { policy, terms } = require('../policy');

const { underMaintenance } = require('../app/src/MAINTENANCE.js');

// IMPORT ROUTES
const Diagram = require('../routes/diagram.js');
const Skill = require('../routes/skill.js');
const Problem = require('../routes/error.js');
const Audio = require('../routes/audio.js');
const Authentication = require('../routes/authentication');
const Code = require('../config/codes.js');
const Marketplace = require('../routes/marketplace.js');
const Multimodal = require('../routes/multimodal/multimodal');
const Onboard = require('../routes/onboard.js');
const Logs = require('../routes/logs.js');
const Team = require('../routes/team.js');
const Project = require('../routes/project.js');
const { copySkill } = require('../routes/skill_util');
const Track = require('../routes/track.js');
const Integrations = require('../routes/integrations');
const GoogleSheets = require('../routes/integrations/googleSheets');
const Custom = require('../routes/integrations/custom');

const { JWT } = require('../lib/clients');
const {
  AnalyticsManager,
  ProjectManager,
  SkillsManager,
  LinkManager,
  ProductManager,
  EmailManager,
  TTSManager,
  AdminManager,
} = require('../lib/services');
const { Project: ProjectMiddleware, Skill: SkillMiddleware } = require('../lib/middleware');
const {
  Analytics: AnalyticsController,
  Linking: LinkingController,
  ProductUpdates: ProductUpdatesController,
  Email: EmailController,
  Decode: DecodeController,
  Test: TestController,
  Admin: AdminController,
} = require('../lib/controllers');

const log = require('../logger');

const responseBuilder = new ResponseBuilder();

/**
 * @class
 * @property {object} services
 * @property {object} middleware
 * @property {object} controllers
 * @property {object} clients
 */
class ServiceManager {
  /**
   * @param {Config} config service configuration
   */
  constructor(config) {
    // Clients
    const clients = ServiceManager.buildClients(config);

    // Services
    const services = ServiceManager.buildServices(config, clients);

    // Middleware
    const middleware = ServiceManager.buildMiddleware(clients, services, config);

    // Controllers
    const controllers = ServiceManager.buildControllers(services);

    Object.assign(this, {
      clients,
      services,
      middleware,
      controllers,
    });
  }

  /**
   * Build all controllers
   * @returns {*}
   */
  static buildControllers(services) {
    const { analyticsManager, projectManager, productManager, emailManager, linkManager, ttsManager, hashids, adminManager } = services;

    const utilities = {
      policy,
      terms,
      teamCopySkill: (req, res) =>
        copySkill(req, res, {
          append_copy_str: true,
          user_copy: true,
        }),
      s3Audio: (req, res) => res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${req.file.key}`),
      uploadTransformImage: (req, res) => res.send(`https://s3.amazonaws.com/com.getstoryflow.api.images/${req.file.transforms[0].key}`),
      uploadImage: (req, res) => res.send(`https://s3.amazonaws.com/com.getstoryflow.audio.production/${req.files[0].key}`),
      readBuildFiles: (req, res) => res.sendFile(path.join(__dirname, '../', 'app', 'build', 'index.html')),
      elasticsearch: async (req, res) => {
        req.body = req.body.substring(24, req.body.length + 1);
        req.body = JSON.parse(req.body);
        const ESparams = req.params[0].split('/');
        const ESoptions = {
          index: ESparams[0],
          type: ESparams[1],
          body: req.body,
        };
        await ESclient.search(ESoptions)
          .then((data) => {
            res.send({ responses: [data] });
          })
          .catch((err) => {
            log.info(err);
          });
      },
    };

    const analytics = new AnalyticsController({
      responseBuilder,
      analyticsManager,
      projectManager,
    });

    const admin = new AdminController({
      adminManager,
      responseBuilder,
    });

    const productUpdates = new ProductUpdatesController({
      productManager,
      responseBuilder,
    });

    const email = new EmailController({
      emailManager,
      responseBuilder,
      hashids,
    });

    const linkAccount = new LinkingController({
      linkManager,
      hashids,
      responseBuilder,
    });

    const decode = new DecodeController({
      hashids,
      responseBuilder,
    });

    const test = new TestController({
      ttsManager,
      responseBuilder,
    });

    return {
      Authentication,
      policy,
      terms,
      test,
      linkAccount,
      email,
      Multimodal,
      decode,
      Skill,
      Project,
      copySkill,
      Marketplace,
      Team,
      Diagram,
      Track,
      Integrations,
      GoogleSheets,
      Custom,
      analytics,
      Onboard,
      productUpdates,
      Logs,
      Code,
      Problem,
      Audio,
      admin,

      // Probably can eventually remove these and replace with actual controllers
      utilities,
    };
  }

  /**
   * Build all middleware
   * @returns {*}
   */
  static buildMiddleware(clients, services) {
    const { projectManager, skillsManager, hashids } = services;

    const ensureLoggedIn = (req, res, next) => (req.user ? next() : res.sendStatus(401));
    const ensurePlan = (plan) => (req, res, next) => (req.user && req.user.admin >= plan ? next() : res.sendStatus(401));
    const ensurePaid = ensurePlan(1);
    const ensureAdmin = ensurePlan(100);
    const ensureLoggedOut = (req, res, next) => (req.user ? res.redirect('/') : next());

    // MARKETPLACE BETA
    const ensureBeta = (req, res, next) => (req.user && req.user.admin === 7 ? next() : res.sendStatus(401));

    const project = new ProjectMiddleware({
      responseBuilder,
      projectManager,
    });

    const skill = new SkillMiddleware({
      responseBuilder,
      skillsManager,
      hashids,
    });

    return {
      isProjectOwner: (req, res, next) => project.isOwner(req, res, next),
      ensureLoggedIn,
      ensurePlan,
      ensurePaid,
      ensureAdmin,
      ensureLoggedOut,
      ensureBeta,
      uploadAudio: upload.single('audio'),
      uploadResize512: uploadResize(512, 512).single('image'),
      uploadResize108: uploadResize(108, 108).single('image'),
      uploadResize40: uploadResize(40, 40).single('image'),
      getProjectFromSkill: Project.getProjectFromSkill,
      uploadAny: upload.any(),
      verify: (req, res, next) => {
        if (underMaintenance()) {
          return res.redirect('https://getvoiceflow.com/maintenance');
        }

        return verify(req.cookies.auth, (data) => {
          if (data) {
            req.user = data.user;
            req.secret = data.secret;
            req.userHash = data.userHash;
          }
          next();
        });
      },
      verifyProjectAccess: Team.verifyProjectAccess,
      verifyTeam: Team.verifyTeam,
      hasSkillAccess: skill.hasSkillAccess,
    };
  }

  /**
   * Build all services
   * @param {object }config
   * @param {object} clients
   * @returns {{projectManager: (ProjectManager|*), analyticsManager: (AnalyticsManager|*), skillsManager: (SkillsManager|*)}}
   */
  static buildServices(config, clients) {
    const { hashids } = require('../services'); // eslint-disable-line
    // The above line is temporary until we finish migrating the routes.

    const { pool, logging_pool, polly, jwt } = clients;

    const projectManager = new ProjectManager({
      pool,
      hashids,
    });

    const skillsManager = new SkillsManager({ pool });
    const analyticsManager = new AnalyticsManager({
      logging_pool,
      skillsManager,
    });

    const productManager = new ProductManager({ pool });

    const emailManager = new EmailManager({
      pool,
      hashids,
    });

    const linkManager = new LinkManager({
      pool,
      hashids,
      jwt,
    });

    const ttsManager = new TTSManager({
      polly,
    });

    const adminManager = new AdminManager({
      pool,
      logging_pool,
    });

    return {
      hashids,
      projectManager,
      skillsManager,
      analyticsManager,
      productManager,
      emailManager,
      linkManager,
      ttsManager,
      adminManager,
    };
  }

  /**
   * Build all clients
   * @returns {*}
   */
  static buildClients() {
    const { logging_pool, pool } = require('../services'); // eslint-disable-line
    // The above line is temporary until we finish migrating the routes.

    AWS.config = new AWS.Config({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
    });

    const jwt = new JWT(process.env.JWT_SECRET);
    const polly = new AWS.Polly();

    return {
      polly: Promise.promisify(polly.synthesizeSpeech.bind(polly)),
      aws: AWS,
      jwt,
      pool,
      logging_pool,
    };
  }

  /**
   * Start services
   * @return {Promise<void>}
   */
  async start() {}

  /**
   * Stop services
   * @return {Promise<void>}
   */
  async stop() {}
}

module.exports = ServiceManager;
