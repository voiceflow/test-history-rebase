'use strict';

/* eslint no-process-exit: "off", no-process-env: "off" */
const express = require('express');
const http = require('http');
const Promise = require('bluebird');
const log = require('./logger');
const { ExpressMiddleware } = require('./backend/');

const { name } = require('./package.json');

/**
 * @class
 */
class Server {
  /**
   * @param {ServiceManager} serviceManager
   * @param {object} serviceManager.services
   * @param {object} serviceManager.middleware
   * @param {object} serviceManager.clients
   * @param {object} serviceManager.controllers
   */
  constructor(serviceManager) {
    this.serviceManager = serviceManager;

    this.server = null;
    this.port = process.env.PORT || 8080;
  }

  /**
   * Start server
   * - Creates express app and services
   * @return {Promise<void>}
   */
  async start() {

    // Start services. This way if pubsub doesn't connect, it'll hang
    await this.serviceManager.start();

    this.app = express();
    this.server = http.createServer(this.app);

    const { middleware, controllers } = this.serviceManager;

    ExpressMiddleware.attach(this.app, middleware, controllers);

    // Socket errors are usually caused by an invalid query string or url
    // This is caught before Node creates req and res objects, so we have to manually write to the socket in response
    this.server.on('clientError', (err, socket) => {
      if (socket.readyStatus !== 'closed') {
        log.error(`Error during request: ${err}`);
        const error = 'Error: Invalid request format or query string\r\n\r\n';
        socket.write('HTTP/1.1 400 Bad Request\r\n');
        socket.write('Content-Type: text/plain\r\n');
        socket.write(`Content-Length: ${Buffer.byteLength(error)}\r\n`);
        socket.write('Connection: close\r\n');
        socket.write(error);
        socket.end();
      }
    });

    await Promise.fromCallback((cb) => this.server.listen(this.port, cb));
    log.info(`${name} listening on port ${this.port}`);
  }

  /**
   * Stop server
   * - Stops services first, then server
   * @return {Promise<void>}
   */
  async stop() {
    // Stop services
    await this.serviceManager.stop();
    await Promise.fromCallback((cb) => this.server && this.server.close(cb));
  }
}

module.exports = Server;
