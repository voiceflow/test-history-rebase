'use strict';

const _ = require('lodash');
const Server = require('../server');
const { ServiceManager } = require('../backend');

module.exports = async (serviceManager = new ServiceManager()) => {
  const server = new Server(serviceManager);
  server.port = _.random(10000, 60000);

  await server.start();
  const { app } = server;

  return {
    app,
    server,
  };
};
