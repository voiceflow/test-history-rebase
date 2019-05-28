'use strict';

const Server = require('../server');
const { ServiceManager } = require('../backend');
require('./../envSetup');
const config = require('./../config');

module.exports = async (serviceManager = new ServiceManager(config)) => {
  const server = new Server(serviceManager);
  server.port = 12000;

  await server.start();
  const { app } = server;

  return {
    app,
    server,
  };
};
