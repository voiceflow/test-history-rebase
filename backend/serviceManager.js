'use strict';

/* eslint-disable class-methods-use-this, no-empty-function */

const AWS = require('aws-sdk');
const sgMail = require('@sendgrid/mail');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');
const Promise = require('bluebird');
const _ = require('lodash');
const { ResponseBuilder } = require('@voiceflow/common').middleware;

const { upload, uploadResize, verify } = require('../services');
const { policy, terms } = require('../policy');

const { underMaintenance } = require('../app/src/MAINTENANCE.js');

// IMPORT ROUTES
const Diagram = require('../routes/diagram.js');
const Skill = require('../routes/skill.js');
const Problem = require('../routes/error.js');
const Audio = require('../routes/audio.js');
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

const { JWT, Segement, MockSegement, staticClients } = require('../lib/clients');
const Managers = require('../lib/services');
const { Project: ProjectMiddleware, Skill: SkillMiddleware } = require('../lib/middleware');
const Controllers = require('../lib/controllers');

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
    const controllers = {};

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
    };

    const routeWrapper = (controller) => {
      _.forOwn(controller, (value, key) => {
        controller[key] = responseBuilder.route(value);
      });
      return controller;
    };

    _.forOwn(Controllers, (Controller, name) => {
      // convert to camelcase
      name = name.substring(0, 1).toLowerCase() + name.substring(1);

      controllers[name] = routeWrapper(
        new Controller({
          ...services,
        })
      );
    });

    return {
      ...controllers,
      policy,
      terms,
      Multimodal,
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
      Onboard,
      Logs,
      Code,
      Problem,
      Audio,

      // Probably can eventually remove these and replace with actual controllers
      utilities,
    };
  }

  /**
   * Build all middleware
   * @returns {*}
   */
  static buildMiddleware(clients, services) {
    const { projectManager, skillsManager } = services;
    const { hashids } = clients;

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
   * @param {object} config
   * @param {object} clients
   * @returns {{projectManager: (ProjectManager|*), analyticsManager: (AnalyticsManager|*), skillsManager: (SkillsManager|*)}}
   */
  static buildServices(config, clients) {
    const services = {};

    _.forOwn(Managers, (Manager, name) => {
      // convert to camelcase
      const managerIndex = name.indexOf('Manager');
      if (managerIndex === -1) throw new Error(`${name} does not include "Manager" suffix`);
      name = name.substring(0, managerIndex).toLowerCase() + name.substring(managerIndex);

      services[name] = new Manager(
        {
          ...clients,
          ...services,
        },
        config
      );
    });

    return {
      ...clients,
      ...services,
    };
  }

  /**
   * Build all clients
   * @returns {*}
   */
  static buildClients(config) {
    const { logging_pool, pool, hashids, redis } = require('../services'); // eslint-disable-line
    // The above line is temporary until we finish migrating the routes.

    AWS.config = new AWS.Config({
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      region: config.AWS_REGION,
      endpoint: config.AWS_ENDPOINT,
    });

    const googleClient = new OAuth2Client(config.GOOGLE_ID);
    const jwt = new JWT(config.JWT_SECRET);
    const segement = config.SEGEMENT_WRITE_KEY ? new Segement(config.SEGEMENT_WRITE_KEY) : MockSegement();
    const polly = new AWS.Polly();
    sgMail.setApiKey(config.SENDGRID_KEY);

    return {
      ...staticClients,
      polly: Promise.promisify(polly.synthesizeSpeech.bind(polly)),
      aws: AWS,
      jwt,
      redis,
      pool,
      googleClient,
      logging_pool,
      segement,
      hashids,
      sgMail,
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
