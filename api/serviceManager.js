'use strict';

/* eslint-disable class-methods-use-this, no-empty-function */
const AWS = require('aws-sdk');

const {
  upload, uploadResize, ESclient, verify,
} = require('../services');
const { policy, terms } = require('../policy');
const { underMaintenance } = require('../app/src/MAINTENANCE.js');

// IMPORT ROUTES
const Diagram = require('../routes/diagram.js');
const Skill = require('../routes/skill.js');
const Problem = require('../routes/error.js');
const LinkAccount = require('../routes/linkaccount.js');
const Audio = require('../routes/audio.js');
const Test = require('../routes/test.js');
const Authentication = require('../routes/authentication');
const Code = require('../config/codes.js');
const Decode = require('../routes/decode.js');
const Marketplace = require('../routes/marketplace.js');
const Email = require('../routes/email.js');
const Multimodal = require('../routes/multimodal/multimodal');
const Onboard = require('../routes/onboard.js');
const Logs = require('../routes/logs.js');
const Analytics = require('../routes/analytics.js');
const Team = require('../routes/team.js');
const Project = require('../routes/project.js');
const { copySkill } = require('../routes/skill_util');
const Track = require('../routes/track.js');
const ProductUpdates = require('../routes/product_updates.js');
const Integrations = require('../routes/integrations');
const GoogleSheets = require('../routes/integrations/googleSheets');
const Custom = require('../routes/integrations/custom');

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
   * @param {object} services
   * @returns {{search: *, extract: *, projects: *, plans: *, schedules: *, jobs: *, batches: *,
   * health: *, domains: *, tokens: *, proxies: *, workers: *, usageTracker: *}}
   */
  static buildControllers(services) {

    return {
      Authentication,
      policy,
      terms,
      Test,
      LinkAccount,
      Email,
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
      Analytics,
      Onboard,
      ProductUpdates,
      Logs,
      Code,
      Problem,
      Audio,

      // Probably can eventually remove
      upload,
      uploadResize,
      ESclient,
      verify,
    };
  }

  /**
   * Build all middleware
   * @returns {{apiRateLimiter: *, auth: *, usage: *, project: *, extractRateLimiter: *}}
   */
  static buildMiddleware() {
    const ensureLoggedIn = () => (req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.sendStatus(401);
      }
    };
    const ensurePlan = (plan) => (req, res, next) => {
      if (req.user && req.user.admin >= plan) {
        next();
      } else {
        res.sendStatus(401);
      }
    };
    const ensureAdmin = () => ensurePlan(100);
    const ensureLoggedOut = () => (req, res, next) => {
      if (req.user) {
        res.redirect('/');
      } else {
        next();
      }
    };

    // MARKETPLACE BETA
    const ensureBeta = () => (req, res, next) => {
      if (req.user && req.user.admin === 7) {
        next();
      } else {
        res.sendStatus(401);
      }
    };

    return {
      ensureLoggedIn,
      ensurePlan,
      ensureAdmin,
      ensureLoggedOut,
      ensureBeta,
    };
  }

  /**
   * Build all services
   */
  static buildServices() {
  }

  /**
   * Build all clients
   */
  static buildClients() {
    AWS.config = new AWS.Config({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
    });

    return {
      AWS,
    };
  }

  /**
   * Start services
   * @return {Promise<void>}
   */
  async start() {
  }

  /**
   * Stop services
   * @return {Promise<void>}
   */
  async stop() {
  }
}

module.exports = ServiceManager;
