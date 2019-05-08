'use strict';

const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const expressLogger = require('@xtrctio/express-bunyan-logger');
const PrettyStream = require('bunyan-prettystream');
const HttpStatus = require('http-status');
const _ = require('lodash');

const api = require('./api');
const pjson = require('../package.json');
const log = require('../logger');

const name = pjson.name.replace(/^@[a-zA-Z0-9-]+\//g, '');

const prettyStdOut = new PrettyStream({ mode: 'dev' });
prettyStdOut.pipe(process.stdout);

const ERROR_RESPONSE_MS = 10000;
const WARN_RESPONSE_MS = 5000;


/**
 * @class
 */
class ExpressMiddleware {
  /**
   * Attach express middleware to app
   * @param {app} app
   * @param {object} middleware
   * @param {object} controllers
   * @returns {ExpressMiddleware}
   */
  static attach(app, middleware, controllers) {
    if (!_.isObject(app) || !_.isObject(middleware) || !_.isObject(controllers)) {
      throw new Error('must have app, middleware, and controllers');
    }

    app.use(cors());
    app.use(helmet());

    const rawBodyPaths = ['/customer/webhook'];
    const getRawBody = () => (req, res, next) => {
      if (rawBodyPaths.includes(req.path)) {
        return bodyParser.json({
          verify(_req, _res, buf) {
            _req.rawBody = buf;
          },
        })(req, res, next);
      }
      return next();
    };

    app.use(getRawBody());

    // const defaultContentTypeMiddleware = (req, res, next) => {
    //   req.headers['content-type'] = 'application/json';
    //   next();
    // };
    // app.use(defaultContentTypeMiddleware);

    app.use(compression());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
    }));
    app.use(cookieParser());
    app.enable('trust proxy');
    app.disable('x-powered-by');

    const logMiddleware = expressLogger({
      name: `${name}-express`,
      format: ':status-code - :method :url - response-time: :response-time',
      streams: [
        {
          level: 'info',
          stream: prettyStdOut,
        },
      ],
      excludes: ['*'],
      levelFn: (status, err, meta) => {
        if (meta['response-time'] > ERROR_RESPONSE_MS) {
          return 'error';
        }
        if (meta['response-time'] > WARN_RESPONSE_MS) {
          return 'warn';
        }
        if (meta['status-code'] >= HttpStatus.INTERNAL_SERVER_ERROR) {
          return 'error';
        }
        if (meta['status-code'] >= HttpStatus.BAD_REQUEST) {
          return 'warn';
        }
        return 'trace'; // Do not log 200
      },
    });

    app.use(logMiddleware);

    // All valid routes handled here
    app.use(api(middleware, controllers));

    // Handle errors that are otherwise unhandled for some reason
    // app.use(async (err, req, res, next) => exceptionHandler.handleError(err, req, res, next));
    //
    // // Everything else is a 404
    // app.use(async (req, res) => exceptionHandler.handleNotFound(req, res));
  }
}

module.exports = ExpressMiddleware;
