'use strict';

const _ = require('lodash');
const Server = require('../server');
const { ServiceManager } = require('../backend');

let lastPort = 10000;

module.exports = async (serviceManager = new ServiceManager()) => {
  const server = new Server(serviceManager);
  server.port = lastPort;
  lastPort++;

  await server.start();
  const { app } = server;

  return {
    app,
    server,
  };
};
