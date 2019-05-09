'use strict';

/* eslint-disable class-methods-use-this, no-empty-function */
const AWS = require('aws-sdk');

const {
  upload, uploadResize, ESclient, verify,
} = require('../services');
const { policy, terms } = require('../policy');
const path = require('path');

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
   * @returns {*}
   */
  static buildControllers() {
    const utilities = {
      policy,
      terms,
      teamCopySkill: (req, res) => copySkill(req, res, {
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
            console.log(err);
          });
      },
    };

    return {
      Authentication,
      policy,
      terms,
      Test,
      LinkAccount,
      Email,
      Multimodal,
      Decode,
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

      // Probably can eventually remove these and replace with actual controllers
      utilities,
    };
  }

  /**
   * Build all middleware
   * @returns {*}
   */
  static buildMiddleware() {
    const ensureLoggedIn = (req, res, next) => (req.user ? next() : res.sendStatus(401));
    const ensurePlan = (plan) => (req, res, next) => ((req.user && req.user.admin >= plan) ? next() : res.sendStatus(401));
    const ensureAdmin = ensurePlan(100);
    const ensureLoggedOut = (req, res, next) => (req.user ? res.redirect('/') : next());

    // MARKETPLACE BETA
    const ensureBeta = (req, res, next) => ((req.user && req.user.admin === 7) ? next() : res.sendStatus(401));

    return {
      ensureLoggedIn,
      ensurePlan,
      ensureAdmin,
      ensureLoggedOut,
      ensureBeta,
      uploadAudio: upload.single('audio'),
      uploadResize512: uploadResize(512, 512).single('image'),
      uploadResize108: uploadResize(108, 108).single('image'),
      uploadResize40: uploadResize(40, 40).single('image'),
      getProjectFromSkill: Project.getProjectFromSkill,
      uploadAny: upload.any,
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
    };
  }

  /**
   * Build all services
   * @returns {*}
   */
  static buildServices() {
  }

  /**
   * Build all clients
   * @returns {*}
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
