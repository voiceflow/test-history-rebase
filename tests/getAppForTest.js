'use strict';

const Server = require('../server');
const { ServiceManager } = require('../backend');

module.exports = async (serviceManager = new ServiceManager()) => {
  const server = new Server(serviceManager);
  server.port = 12000;

  await server.start();
  const { app } = server;

  return {
    app,
    server,
  };
};
